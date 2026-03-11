import { Card, CardContent } from '@/shared/components/ui/card'
import { cn } from '@/shared/components/ui/lib/utils'
import { type GrowthStage, getGrowthLabel } from '@/shared/components/ui/lib/growth'
import { SeedCharacter } from '@/shared/components/ui/seed-character'
import { Text } from '@/shared/components/ui/text'
import * as React from 'react'
import { Pressable, View } from 'react-native'

interface GrowthJourneyProps {
  currentStage: GrowthStage
  reviewCount: number
  currentStreak?: number
  onPress?: () => void
}

/** Returns the review count threshold at which a stage begins. */
function stageStart(stage: GrowthStage): number {
  switch (stage) {
    case 1: return 0
    case 2: return 2
    case 3: return 6
    case 4: return 12
    case 5: return 20
  }
}

/** Returns the review count threshold for the next stage (undefined at max). */
function stageEnd(stage: GrowthStage): number | undefined {
  switch (stage) {
    case 1: return 2
    case 2: return 6
    case 3: return 12
    case 4: return 20
    case 5: return undefined
  }
}

function getMotivationalMessage(currentStage: GrowthStage, reviewCount: number): string {
  if (currentStage === 5) return '완전히 피어났어요! 최고예요 🌸'
  const nextStage = (currentStage + 1) as GrowthStage
  const nextLabel = getGrowthLabel(nextStage)
  const end = stageEnd(currentStage)
  if (end === undefined) return '완전히 피어났어요!'
  const remaining = end - reviewCount
  return `${remaining}회 더 암송하면 ${nextLabel}로!`
}

const ALL_STAGES: GrowthStage[] = [1, 2, 3, 4, 5]

export function GrowthJourney({ currentStage, reviewCount, currentStreak, onPress }: GrowthJourneyProps) {
  const stageLabel = getGrowthLabel(currentStage)
  const motivationalMessage = getMotivationalMessage(currentStage, reviewCount)

  return (
    <Pressable onPress={onPress} className="active:opacity-80">
      <Card className="border-border">
        <CardContent className="py-4 px-4">
          {/* Title row */}
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-semibold text-foreground">나의 성장 여정</Text>
            <View className="flex-row items-center gap-2">
              {currentStreak !== undefined && currentStreak > 0 && (
                <View className="px-2 py-0.5 rounded-full bg-secondary mr-1">
                  <Text className="text-xs text-secondary-foreground">연속 {currentStreak}일</Text>
                </View>
              )}
              <View className="px-2.5 py-0.5 rounded-full bg-seed/20">
                <Text className="text-xs font-medium text-seed">{stageLabel}</Text>
              </View>
            </View>
          </View>

          {/* Stage row */}
          <View className="flex-row items-end justify-between px-1">
            {ALL_STAGES.map((stage, index) => {
              const isPast = stage < currentStage
              const isCurrent = stage === currentStage
              const isFuture = stage > currentStage

              return (
                <View key={stage} className="flex-row items-center flex-1">
                  {/* Connector line before (except first) */}
                  {index > 0 && (
                    <View
                      className={cn(
                        'flex-1 h-0.5 mb-2',
                        isPast || isCurrent ? 'bg-seed/60' : 'bg-border'
                      )}
                    />
                  )}

                  {/* Stage character */}
                  <View
                    className={cn(
                      'items-center',
                      isCurrent && 'mb-2'
                    )}
                  >
                    <View
                      style={isFuture ? { opacity: 0.28 } : undefined}
                    >
                      <SeedCharacter
                        stage={stage}
                        size={isCurrent ? 44 : 28}
                      />
                    </View>
                  </View>
                </View>
              )
            })}
          </View>

          {/* Motivational message */}
          <Text variant="muted" className="text-center mt-2 text-xs">
            {motivationalMessage}
          </Text>
        </CardContent>
      </Card>
    </Pressable>
  )
}
