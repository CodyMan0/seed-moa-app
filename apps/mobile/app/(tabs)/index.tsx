import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Text } from '@/shared/components/ui/text'
import { SeedCharacter, getGrowthStage, getGrowthLabel, getGrowthColor } from '@/shared/components/ui/seed-character'
import { useSession } from '@/shared/hooks/useSession'
import { getDueVerses } from '@/entities/memorize'
import { supabase } from '@/shared/supabase/supabase'
import { MemorizeCalendar } from '@/widgets/calendar'
import type { Database } from '@/shared/supabase/types'
import { router, useFocusEffect } from 'expo-router'
import { GroundBackground } from '@/shared/components/ui/ground-background'
import * as React from 'react'
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type MemorizeVerseRow = Database['public']['Tables']['memorize_verses']['Row']

export default function HomeScreen() {
  const { session, isLoading: sessionLoading } = useSession()
  const [dueVerses, setDueVerses] = React.useState<MemorizeVerseRow[]>([])
  const [practicedDates, setPracticedDates] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [refreshing, setRefreshing] = React.useState(false)

  const fetchData = React.useCallback(async () => {
    if (!session?.user?.id) {
      setIsLoading(false)
      return
    }
    try {
      const [versesData, reviewLogsData] = await Promise.all([
        getDueVerses(session.user.id),
        supabase
          .from('review_logs')
          .select('practiced_at')
          .eq('user_id', session.user.id)
          .then(({ data }) => data),
      ])
      setDueVerses(versesData)

      const dates = reviewLogsData
        ?.map((log) => log.practiced_at?.split('T')[0])
        .filter((d): d is string => Boolean(d)) ?? []
      setPracticedDates([...new Set(dates)])
    } catch (error) {
      console.error('Failed to fetch home data:', error)
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }, [session?.user?.id])

  useFocusEffect(
    React.useCallback(() => {
      fetchData()
    }, [fetchData])
  )

  const handleRefresh = () => {
    setRefreshing(true)
    fetchData()
  }

  if (sessionLoading || isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="hsl(25 40% 64%)" />
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <GroundBackground />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-8 pt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* 오늘의 암송 - 최상단 */}
        <Text variant="h3" className="mb-4 text-foreground">
          오늘의 암송
        </Text>

        {dueVerses.length === 0 ? (
          <View className="mb-6 gap-4">
            <View className="w-full rounded-xl border border-border bg-card p-6 items-center gap-4">
              <SeedCharacter stage={1} size={48} />
              <Text variant="muted" className="text-center">
                오늘 암송할 구절이 없습니다
              </Text>
            </View>

            <Button
              size="lg"
              className="w-full bg-bloom"
              onPress={() => router.push('/(tabs)/bible')}
            >
              <Text className="text-white font-semibold">구절 추가하기</Text>
            </Button>
          </View>
        ) : (
          <View className="mb-6 gap-3">
            <Text variant="muted" className="mb-1">
              {dueVerses.length}개의 구절이 암송을 기다리고 있어요
            </Text>

            {dueVerses.map((verse) => {
              const stage = getGrowthStage(verse.review_count, verse.status)
              const dotColor = getGrowthColor(stage)
              return (
                <Pressable
                  key={verse.id}
                  onPress={() => router.push(`/practice/${verse.id}`)}
                >
                  <Card className="border-border">
                    <CardContent className="py-4 gap-2">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                          <View className={`h-3 w-3 rounded-full ${dotColor}`} />
                          <Text className="font-semibold text-foreground">
                            {verse.reference}
                          </Text>
                        </View>
                        <View className="px-2 py-0.5 rounded-full bg-secondary">
                          <Text className="text-xs text-secondary-foreground">
                            {getGrowthLabel(stage)}
                          </Text>
                        </View>
                      </View>
                      <Text variant="muted" numberOfLines={2}>
                        {verse.text}
                      </Text>
                    </CardContent>
                  </Card>
                </Pressable>
              )
            })}
          </View>
        )}

        {/* Calendar */}
        <View className="mb-6">
          <MemorizeCalendar practicedDates={practicedDates} joinedAt={session?.user?.created_at} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
