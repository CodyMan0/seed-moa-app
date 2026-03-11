import { supabase } from '@/shared/supabase/supabase'
import { calculateNextReview } from '@/features/practice/lib/spaced-repetition'

export async function completeReview(
  verseId: string,
  userId: string,
  quality: number,
  mode: string,
  currentEaseFactor: number,
  currentInterval: number,
  reviewCount: number
) {
  const result = calculateNextReview(quality, currentEaseFactor, currentInterval, reviewCount)

  await supabase.from('review_logs').insert({
    verse_id: verseId,
    user_id: userId,
    quality,
    mode,
  })

  await supabase
    .from('memorize_verses')
    .update({
      ease_factor: result.easeFactor,
      interval_days: result.intervalDays,
      next_review_at: result.nextReviewAt.toISOString(),
      review_count: reviewCount + 1,
      status: result.intervalDays >= 30 ? 'mastered' : 'learning',
    })
    .eq('id', verseId)

  const today = new Date().toISOString().split('T')[0]
  const { data: streak } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('id', userId)
    .single()

  if (streak) {
    const lastDate = streak.last_practiced_date
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    let newStreak = streak.current_streak ?? 0
    if (lastDate === yesterdayStr) {
      newStreak += 1
    } else if (lastDate !== today) {
      newStreak = 1
    }

    const longestStreak = Math.max(newStreak, streak.longest_streak ?? 0)

    await supabase
      .from('user_streaks')
      .update({
        current_streak: newStreak,
        longest_streak: longestStreak,
        last_practiced_date: today,
      })
      .eq('id', userId)
  }

  return result
}
