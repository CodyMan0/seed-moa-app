import { supabase } from '@/shared/supabase/supabase'

export async function submitInquiry(params: {
  userId: string
  category: string
  content: string
  email?: string
}) {
  const { error } = await supabase.from('inquiries').insert({
    user_id: params.userId,
    category: params.category,
    content: params.content,
    email: params.email ?? null,
  })
  if (error) throw error
}
