import { Text } from '@/shared/components/ui/text'
import { Button } from '@/shared/components/ui/button'
import { SeedCharacter, getGrowthStage, getGrowthLabel } from '@/shared/components/ui/seed-character'
import { GroundBackground } from '@/shared/components/ui/ground-background'
import { useSession } from '@/shared/hooks/useSession'
import { getMemorizeVerse } from '@/entities/memorize'
import { PracticeScreen } from '@/features/practice'
import { completeReview } from '@/features/review'
import { supabase } from '@/shared/supabase/supabase'
import type { Database } from '@/shared/supabase/types'
import { router, useLocalSearchParams } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import * as React from 'react'
import { ActivityIndicator, Alert, Pressable, View } from 'react-native'
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

  const [practiceCompleted, setPracticeCompleted] = React.useState(false)

  const handleComplete = async (quality: number) => {
    if (!verse || !session?.user?.id) return
    try {
      await completeReview(
        verse.id,
        session.user.id,
        quality,
        'typing'
      )
      setPracticeCompleted(true)
    } catch (err) {
      console.error('Failed to complete review:', err)
      Alert.alert('오류', '복습 완료 처리에 실패했습니다. 다시 시도해주세요.', [
        { text: '확인', onPress: () => router.back() },
      ])
    }
  }

  const handleMastered = async () => {
    if (!verse) return
    try {
      await supabase
        .from('memorize_verses')
        .update({ status: 'mastered' })
        .eq('id', verse.id)
    } catch (err) {
      console.error('Failed to mark as mastered:', err)
    }
    router.back()
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center" edges={['top', 'bottom']}>
        <GroundBackground />
        <ActivityIndicator size="large" color="hsl(25 40% 64%)" />
      </SafeAreaView>
    )
  }

  if (error || !verse) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
        <GroundBackground />
        <View className="flex-1 items-center justify-center px-6 gap-6">
          <Text variant="muted">
            {error ?? '구절을 찾을 수 없습니다'}
          </Text>
          <Button variant="outline" className="w-full border-border" onPress={() => router.back()}>
            <Text className="text-foreground">돌아가기</Text>
          </Button>
        </View>
      </SafeAreaView>
    )
  }

  const stage = getGrowthStage(verse.review_count, verse.status)

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <GroundBackground />
      {/* Header with back button */}
      <View className="flex-row items-center px-4 pt-2 pb-1">
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center py-2 pr-4 active:opacity-60"
        >
          <ChevronLeft size={22} color="hsl(30 36% 17%)" />
          <Text className="text-base text-foreground">이전</Text>
        </Pressable>
        <View className="flex-1 flex-row items-center justify-center gap-2 mr-10">
          <SeedCharacter stage={stage} size={28} />
          <Text className="text-sm text-muted-foreground">
            {getGrowthLabel(stage)} 단계
          </Text>
        </View>
      </View>
      {practiceCompleted ? (
        <View className="flex-1 items-center justify-center px-6 gap-6">
          <SeedCharacter stage={getGrowthStage(verse.review_count, verse.status)} size={64} />
          <Text variant="h3" className="text-foreground text-center">
            암송 연습 완료!
          </Text>
          <Text variant="muted" className="text-center">
            이 구절을 외웠나요?
          </Text>
          <View className="w-full gap-3">
            <Button
              size="lg"
              className="w-full bg-bloom"
              onPress={handleMastered}
            >
              <Text className="text-white font-semibold">외웠어요!</Text>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full border-border"
              onPress={() => router.back()}
            >
              <Text className="text-foreground">계속 암송하기</Text>
            </Button>
          </View>
        </View>
      ) : (
        <PracticeScreen
          verseText={verse.text}
          reference={verse.reference}
          onComplete={handleComplete}
        />
      )}
    </SafeAreaView>
  )
}
