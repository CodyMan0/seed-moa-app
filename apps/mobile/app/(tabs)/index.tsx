import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Text } from '@/shared/components/ui/text'
import { useSession } from '@/shared/hooks/useSession'
import { getDueVerses, getUserStreak } from '@/entities/memorize'
import { supabase } from '@/shared/supabase/supabase'
import { MemorizeCalendar } from '@/widgets/calendar'
import type { Database } from '@/shared/supabase/types'
import { router, useFocusEffect } from 'expo-router'
import * as React from 'react'
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, View } from 'react-native'

type MemorizeVerseRow = Database['public']['Tables']['memorize_verses']['Row']
type UserStreakRow = Database['public']['Tables']['user_streaks']['Row']

export default function HomeScreen() {
  const { session, isLoading: sessionLoading } = useSession()
  const [dueVerses, setDueVerses] = React.useState<MemorizeVerseRow[]>([])
  const [streak, setStreak] = React.useState<UserStreakRow | null>(null)
  const [practicedDates, setPracticedDates] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [refreshing, setRefreshing] = React.useState(false)

  const fetchData = React.useCallback(async () => {
    if (!session?.user?.id) {
      setIsLoading(false)
      return
    }
    try {
      const [versesData, streakData, reviewLogsData] = await Promise.all([
        getDueVerses(session.user.id),
        getUserStreak(session.user.id).catch(() => null),
        supabase
          .from('review_logs')
          .select('practiced_at')
          .eq('user_id', session.user.id)
          .then(({ data }) => data),
      ])
      setDueVerses(versesData)
      setStreak(streakData)

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
        <ActivityIndicator size="large" />
      </View>
    )
  }

  const statusLabel = (status: string) => {
    switch (status) {
      case 'mastered':
        return '완료'
      default:
        return '학습 중'
    }
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'mastered':
        return 'bg-green-100 dark:bg-green-900'
      default:
        return 'bg-yellow-100 dark:bg-yellow-900'
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-6 py-8"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Streak */}
      {streak && (streak.current_streak ?? 0) > 0 && (
        <Card className="mb-6">
          <CardContent className="py-4 items-center">
            <Text className="text-3xl mb-1">
              {streak.current_streak}
            </Text>
            <Text variant="muted">
              연속 {streak.current_streak}일 암송 중
            </Text>
          </CardContent>
        </Card>
      )}

      {/* Calendar */}
      <View className="mb-6">
        <MemorizeCalendar practicedDates={practicedDates} />
      </View>

      <Text variant="h3" className="mb-6 text-foreground">
        오늘의 암송
      </Text>

      {dueVerses.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-6">
          <View className="w-full rounded-xl border border-border bg-card p-6">
            <Text variant="muted" className="text-center">
              오늘 복습할 구절이 없습니다
            </Text>
          </View>

          <Button
            size="lg"
            className="w-full"
            onPress={() => router.push('/(tabs)/bible')}
          >
            <Text>구절 추가하기</Text>
          </Button>
        </View>
      ) : (
        <View className="gap-3">
          <Text variant="muted" className="mb-1">
            {dueVerses.length}개의 구절이 복습을 기다리고 있어요
          </Text>

          {dueVerses.map((verse) => (
            <Pressable
              key={verse.id}
              onPress={() => router.push(`/practice/${verse.id}`)}
            >
              <Card>
                <CardContent className="py-4 gap-2">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-semibold text-foreground">
                      {verse.reference}
                    </Text>
                    <View className={`px-2 py-0.5 rounded-full ${statusColor(verse.status ?? '')}`}>
                      <Text className="text-xs">
                        {statusLabel(verse.status ?? '')}
                      </Text>
                    </View>
                  </View>
                  <Text variant="muted" numberOfLines={2}>
                    {verse.text}
                  </Text>
                </CardContent>
              </Card>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  )
}
