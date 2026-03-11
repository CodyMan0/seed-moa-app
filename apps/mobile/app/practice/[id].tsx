import { Text } from '@/shared/components/ui/text'
import { Button } from '@/shared/components/ui/button'
import { useSession } from '@/shared/hooks/useSession'
import { getMemorizeVerse } from '@/entities/memorize'
import { PracticeScreen } from '@/features/practice'
import { completeReview } from '@/features/review'
import type { Database } from '@/shared/supabase/types'
import { router, useLocalSearchParams } from 'expo-router'
import * as React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type MemorizeVerseRow = Database['public']['Tables']['memorize_verses']['Row']

export default function PracticeScreenPage() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { session } = useSession()
  const [verse, setVerse] = React.useState<MemorizeVerseRow | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchVerse() {
      if (!id) return
      try {
        const data = await getMemorizeVerse(id)
        setVerse(data)
      } catch (err) {
        console.error('Failed to fetch verse:', err)
        setError('구절을 불러올 수 없습니다')
      } finally {
        setIsLoading(false)
      }
    }
    fetchVerse()
  }, [id])

  const handleComplete = async (quality: number) => {
    if (!verse || !session?.user?.id) return
    try {
      await completeReview(
        verse.id,
        session.user.id,
        quality,
        'typing',
        verse.ease_factor ?? 2.5,
        verse.interval_days ?? 1,
        verse.review_count ?? 0
      )
      router.back()
    } catch (err) {
      console.error('Failed to complete review:', err)
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center" edges={['bottom']}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    )
  }

  if (error || !verse) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
        <View className="flex-1 items-center justify-center px-6 gap-6">
          <Text variant="muted">
            {error ?? '구절을 찾을 수 없습니다'}
          </Text>
          <Button variant="outline" className="w-full" onPress={() => router.back()}>
            <Text>돌아가기</Text>
          </Button>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <PracticeScreen
        verseText={verse.text}
        reference={verse.reference}
        onComplete={handleComplete}
      />
    </SafeAreaView>
  )
}
