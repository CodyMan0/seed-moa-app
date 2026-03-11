import { supabase } from '@/shared/supabase/supabase'

export interface MonthlyStats {
  year: number
  month: number
  practicedDays: number
  totalReviews: number
  versesCompleted: number // mastered this month
  growthStage: 1 | 2 | 3 | 4 | 5
}

/**
 * Get growth stage based on practiced days in a month
 * 1-4일: 씨앗 (stage 1)
 * 5-9일: 새싹 (stage 2)
 * 10-14일: 줄기 (stage 3)
 * 15-22일: 꽃봉오리 (stage 4)
 * 23일+: 꽃 (stage 5)
 */
export function getMonthlyGrowthStage(practicedDays: number): 1 | 2 | 3 | 4 | 5 {
  if (practicedDays >= 23) return 5
  if (practicedDays >= 15) return 4
  if (practicedDays >= 10) return 3
  if (practicedDays >= 5) return 2
  return 1
}

export async function getMonthlyStats(userId: string, year: number, month: number): Promise<MonthlyStats> {
  // month is 1-based (1=January)
  const startDate = new Date(year, month - 1, 1).toISOString()
  const endDate = new Date(year, month, 0, 23, 59, 59).toISOString() // last day of month

  // Get review logs for the month
  const { data: logs } = await supabase
    .from('review_logs')
    .select('practiced_at')
    .eq('user_id', userId)
    .gte('practiced_at', startDate)
    .lte('practiced_at', endDate)

  // Count unique practiced days
  const uniqueDays = new Set(
    logs?.map((log) => log.practiced_at?.split('T')[0]).filter(Boolean) ?? []
  )
  const practicedDays = uniqueDays.size
  const totalReviews = logs?.length ?? 0

  // Count distinct verse_ids that had reviews this month
  const { data: reviewedVerseIds } = await supabase
    .from('review_logs')
    .select('verse_id')
    .eq('user_id', userId)
    .gte('practiced_at', startDate)
    .lte('practiced_at', endDate)

  // Count unique verses reviewed
  const uniqueVerses = new Set(reviewedVerseIds?.map((r) => r.verse_id) ?? [])

  return {
    year,
    month,
    practicedDays,
    totalReviews,
    versesCompleted: uniqueVerses.size,
    growthStage: getMonthlyGrowthStage(practicedDays),
  }
}

export async function getMonthlyHistory(userId: string, monthCount: number = 6): Promise<MonthlyStats[]> {
  const now = new Date()
  const results: MonthlyStats[] = []

  for (let i = 0; i < monthCount; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const stats = await getMonthlyStats(userId, date.getFullYear(), date.getMonth() + 1)
    results.push(stats)
  }

  return results
}
