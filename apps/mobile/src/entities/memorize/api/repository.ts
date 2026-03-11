import { supabase } from '@/shared/supabase/supabase'

export async function getMemorizeVerses(userId: string) {
  const { data, error } = await supabase
    .from('memorize_verses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getDueVerses(userId: string) {
  const { data, error } = await supabase
    .from('memorize_verses')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'learning')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function getUserStreak(userId: string) {
  const { data, error } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export async function getMemorizeVerse(verseId: string) {
  const { data, error } = await supabase
    .from('memorize_verses')
    .select('*')
    .eq('id', verseId)
    .single()
  if (error) throw error
  return data
}
