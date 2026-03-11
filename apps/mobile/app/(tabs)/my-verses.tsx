import { Card, CardContent } from '@/shared/components/ui/card'
import { Text } from '@/shared/components/ui/text'
import { SeedCharacter, getGrowthStage, getGrowthLabel } from '@/shared/components/ui/seed-character'
import { useSession } from '@/shared/hooks/useSession'
import { getMemorizeVerses } from '@/entities/memorize'
import type { Database } from '@/shared/supabase/types'
import { router, useFocusEffect } from 'expo-router'
import * as React from 'react'
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native'

type MemorizeVerseRow = Database['public']['Tables']['memorize_verses']['Row']

export default function MyVersesScreen() {
  const { session, isLoading: sessionLoading } = useSession()
  const [verses, setVerses] = React.useState<MemorizeVerseRow[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchVerses = React.useCallback(async () => {
    if (!session?.user?.id) {
      setIsLoading(false)
      return
    }
    try {
      const data = await getMemorizeVerses(session.user.id)
      setVerses(data)
    } catch (error) {
      console.error('Failed to fetch verses:', error)
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.id])

  useFocusEffect(
    React.useCallback(() => {
      fetchVerses()
    }, [fetchVerses])
  )

  if (sessionLoading || isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="hsl(25 40% 64%)" />
      </View>
    )
  }

  const learningVerses = verses.filter((v) => v.status !== 'mastered')
  const masteredVerses = verses.filter((v) => v.status === 'mastered')

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  const renderVerseCard = (verse: MemorizeVerseRow) => {
    const stage = getGrowthStage(verse.review_count, verse.status)
    return (
      <Pressable
        key={verse.id}
        onPress={() => router.push(`/practice/${verse.id}`)}
      >
        <Card className="border-border">
          <CardContent className="py-4 gap-1">
            <View className="flex-row items-center gap-3">
              <SeedCharacter stage={stage} size={32} />
              <View className="flex-1 gap-1">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <Text className="font-semibold text-foreground">
                      {verse.reference}
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      {getGrowthLabel(stage)}
                    </Text>
                  </View>
                  <Text variant="muted" className="text-xs">
                    다음 복습: {verse.next_review_at ? formatDate(verse.next_review_at) : '-'}
                  </Text>
                </View>
                <Text variant="muted" numberOfLines={1}>
                  {verse.text}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </Pressable>
    )
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-6 py-8"
    >
      <View className="flex-row items-center justify-between mb-6">
        <Text variant="h3" className="text-foreground">
          내 암송 구절
        </Text>
        <Text variant="muted">
          총 {verses.length}개
        </Text>
      </View>

      {verses.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <View className="w-full rounded-xl border border-border bg-card p-8 items-center gap-4">
            <SeedCharacter stage={1} size={48} />
            <Text variant="muted" className="text-center">
              아직 암송 중인 구절이 없습니다
            </Text>
          </View>
        </View>
      ) : (
        <View className="gap-6">
          {/* Learning section */}
          {learningVerses.length > 0 && (
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <View className="h-2 w-2 rounded-full bg-sprout" />
                <Text className="font-semibold text-foreground">
                  암송 중 ({learningVerses.length})
                </Text>
              </View>
              {learningVerses.map(renderVerseCard)}
            </View>
          )}

          {/* Mastered section */}
          {masteredVerses.length > 0 && (
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <View className="h-2 w-2 rounded-full bg-bloom" />
                <Text className="font-semibold text-foreground">
                  완료 ({masteredVerses.length})
                </Text>
              </View>
              {masteredVerses.map(renderVerseCard)}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  )
}
