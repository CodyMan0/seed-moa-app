import { Card, CardContent } from '@/shared/components/ui/card'
import { SeedCharacter, getGrowthLabel } from '@/shared/components/ui/seed-character'
import { Text } from '@/shared/components/ui/text'
import { GroundBackground } from '@/shared/components/ui/ground-background'
import { useSession } from '@/shared/hooks/useSession'
import {
  getMonthlyStats,
  getMonthlyHistory,
  getMonthlyGrowthStage,
  type MonthlyStats,
} from '@/entities/monthly-stats'
import { useFocusEffect } from 'expo-router'
import * as React from 'react'
import { ActivityIndicator, RefreshControl, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type GrowthStage = 1 | 2 | 3 | 4 | 5

const STAGE_INFO: {
  stage: GrowthStage
  label: string
  start: number
  end: number | undefined
}[] = [
  { stage: 1, label: '씨앗', start: 0, end: 5 },
  { stage: 2, label: '새싹', start: 5, end: 10 },
  { stage: 3, label: '줄기', start: 10, end: 15 },
  { stage: 4, label: '꽃봉오리', start: 15, end: 23 },
  { stage: 5, label: '꽃', start: 23, end: undefined },
]

function ProgressBar({ progress }: { progress: number }) {
  const clamped = Math.min(1, Math.max(0, progress))
  return (
    <View className="h-2.5 rounded-full bg-secondary overflow-hidden">
      <View
        className="h-full rounded-full bg-seed"
        style={{ width: `${Math.round(clamped * 100)}%` }}
      />
    </View>
  )
}

function formatMonthLabel(year: number, month: number): string {
  return `${year}년 ${month}월`
}

function formatShortMonthLabel(month: number): string {
  return `${month}월`
}

export default function GrowthScreen() {
  const { session, isLoading: sessionLoading } = useSession()
  const [currentStats, setCurrentStats] = React.useState<MonthlyStats | null>(null)
  const [history, setHistory] = React.useState<MonthlyStats[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [refreshing, setRefreshing] = React.useState(false)

  const fetchData = React.useCallback(async () => {
    if (!session?.user?.id) {
      setIsLoading(false)
      return
    }
    try {
      const now = new Date()
      const [stats, hist] = await Promise.all([
        getMonthlyStats(session.user.id, now.getFullYear(), now.getMonth() + 1),
        getMonthlyHistory(session.user.id, 6),
      ])
      setCurrentStats(stats)
      // Only show months with actual activity, exclude current month
      setHistory(hist.filter((m) => m.practicedDays > 0 && !(m.year === now.getFullYear() && m.month === now.getMonth() + 1)))
    } catch (error) {
      console.error('Failed to fetch monthly growth data:', error)
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

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true)
    fetchData()
  }, [fetchData])

  if (sessionLoading || isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="hsl(25 40% 64%)" />
      </View>
    )
  }

  const practicedDays = currentStats?.practicedDays ?? 0
  const totalReviews = currentStats?.totalReviews ?? 0
  const versesCompleted = currentStats?.versesCompleted ?? 0
  const currentStage = getMonthlyGrowthStage(practicedDays) as GrowthStage

  const currentInfo = STAGE_INFO[currentStage - 1]
  const nextInfo = currentStage < 5 ? STAGE_INFO[currentStage] : null

  const stageProgress = currentInfo.end !== undefined
    ? (practicedDays - currentInfo.start) / (currentInfo.end - currentInfo.start)
    : 1

  const remainingForNext = nextInfo
    ? Math.max(0, (currentInfo.end ?? 0) - practicedDays)
    : 0

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  // Past months only (exclude current month from history list)
  const pastMonths = history.slice(1)

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <GroundBackground />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 py-8"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
      {/* Current Month Hero */}
      <View className="items-center mb-8 gap-3">
        <SeedCharacter stage={currentStage} size={120} />
        <Text className="text-base text-muted-foreground">
          {formatMonthLabel(currentYear, currentMonth)}
        </Text>
        <Text className="text-2xl font-bold text-foreground">
          {getGrowthLabel(currentStage)}
        </Text>
        <View className="px-3 py-1 rounded-full bg-secondary">
          <Text className="text-sm text-secondary-foreground">
            이번 달 {practicedDays}일 암송
          </Text>
        </View>
      </View>

      {/* Current Month Stats Cards */}
      <View className="flex-row gap-2 mb-6">
        <Card className="border-border flex-1">
          <CardContent className="py-3 px-3 items-center">
            <Text className="text-xl font-bold text-foreground">{practicedDays}일</Text>
            <Text className="text-xs text-muted-foreground mt-0.5">암송한 날</Text>
          </CardContent>
        </Card>
        <Card className="border-border flex-1">
          <CardContent className="py-3 px-3 items-center">
            <Text className="text-xl font-bold text-foreground">{totalReviews}회</Text>
            <Text className="text-xs text-muted-foreground mt-0.5">총 암송</Text>
          </CardContent>
        </Card>
        <Card className="border-border flex-1">
          <CardContent className="py-3 px-3 items-center">
            <Text className="text-xl font-bold text-foreground">{versesCompleted}개</Text>
            <Text className="text-xs text-muted-foreground mt-0.5">암송 구절</Text>
          </CardContent>
        </Card>
      </View>

      {/* Progress to Next Stage */}
      {nextInfo && (
        <Card className="border-border mb-6">
          <CardContent className="py-4 px-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-medium text-foreground">
                {currentInfo.label} → {nextInfo.label}
              </Text>
              <Text className="text-xs text-muted-foreground">
                {practicedDays - currentInfo.start}/{currentInfo.end! - currentInfo.start}일
              </Text>
            </View>
            <ProgressBar progress={stageProgress} />
            <Text className="text-xs text-muted-foreground mt-2 text-center">
              다음 단계까지 {remainingForNext}일 남았어요
            </Text>
          </CardContent>
        </Card>
      )}

      {currentStage === 5 && (
        <Card className="border-border mb-6">
          <CardContent className="py-4 px-4 items-center">
            <Text className="text-sm font-medium text-foreground">
              이번 달 최고 단계를 달성했어요!
            </Text>
          </CardContent>
        </Card>
      )}

      {/* Growth Guide */}
      <Text className="text-lg font-semibold text-foreground mb-3">
        성장 도감
      </Text>
      <Card className="border-border mb-6">
        <CardContent className="py-4 px-3">
          <View className="flex-row justify-around">
            {STAGE_INFO.map((info) => {
              const isCurrent = currentStage === info.stage
              const isPast = currentStage > info.stage
              const dayLabel = info.end !== undefined ? `${info.start}~${info.end - 1}일` : `${info.start}일+`
              return (
                <View
                  key={info.stage}
                  className={`items-center gap-1 rounded-xl px-1 py-2 ${isCurrent ? 'bg-seed/10' : ''}`}
                  style={{ opacity: isCurrent || isPast ? 1 : 0.3 }}
                >
                  <SeedCharacter stage={info.stage} size={isCurrent ? 48 : 40} />
                  <Text className={`text-xs font-semibold text-foreground ${isCurrent ? 'text-seed' : ''}`}>
                    {info.label}
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    {dayLabel}
                  </Text>
                </View>
              )
            })}
          </View>
        </CardContent>
      </Card>

      {/* Monthly History */}
      <Text className="text-lg font-semibold text-foreground mb-3">
        월별 기록
      </Text>
      {pastMonths.length > 0 ? (
        <View className="gap-2">
          {pastMonths.map((monthData) => {
            const stage = monthData.growthStage as GrowthStage
            return (
              <Card
                key={`${monthData.year}-${monthData.month}`}
                className="border-border"
              >
                <CardContent className="py-3 px-3">
                  <View className="flex-row items-center gap-3">
                    <SeedCharacter stage={stage} size={44} />
                    <View className="flex-1">
                      <Text className="font-medium text-foreground">
                        {formatMonthLabel(monthData.year, monthData.month)}
                      </Text>
                      <Text className="text-xs text-muted-foreground mt-0.5">
                        {monthData.practicedDays}일 암송
                      </Text>
                    </View>
                    <View className="px-2 py-0.5 rounded-full bg-secondary">
                      <Text className="text-xs text-secondary-foreground">
                        {getGrowthLabel(stage)}
                      </Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            )
          })}
        </View>
      ) : (
        <Card className="border-border">
          <CardContent className="py-6 items-center gap-3">
            <SeedCharacter stage={1} size={48} />
            <Text className="text-sm font-medium text-foreground">
              {new Date().getMonth() + 1}월부터 시작
            </Text>
            <Text variant="muted" className="text-center text-xs">
              이번 달이 지나면 여기에 기록이 쌓여요
            </Text>
          </CardContent>
        </Card>
      )}
      </ScrollView>
    </SafeAreaView>
  )
}
