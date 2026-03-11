import { cn } from '@/shared/components/ui/lib/utils'
import { type GrowthStage, getGrowthLabel } from '@/shared/components/ui/lib/growth'
import { SeedCharacter } from '@/shared/components/ui/seed-character'
import { Text } from '@/shared/components/ui/text'
import * as React from 'react'
import { Modal, Pressable, View } from 'react-native'

interface GrowthDetailSheetProps {
  visible: boolean
  onClose: () => void
  currentStage: GrowthStage
  reviewCount: number
}

const STAGE_INFO: {
  stage: GrowthStage
  label: string
  range: string
  start: number
  end: number | undefined
}[] = [
  { stage: 1, label: '씨앗', range: '0-1회', start: 0, end: 2 },
  { stage: 2, label: '새싹', range: '2-5회', start: 2, end: 6 },
  { stage: 3, label: '줄기', range: '6-11회', start: 6, end: 12 },
  { stage: 4, label: '꽃봉오리', range: '12-19회', start: 12, end: 20 },
  { stage: 5, label: '꽃', range: '20회+', start: 20, end: undefined },
]

function ProgressBar({ progress }: { progress: number }) {
  const clamped = Math.min(1, Math.max(0, progress))
  return (
    <View className="h-2 rounded-full bg-secondary overflow-hidden">
      <View
        className="h-full rounded-full bg-seed"
        style={{ width: `${Math.round(clamped * 100)}%` }}
      />
    </View>
  )
}

export function GrowthDetailSheet({ visible, onClose, currentStage, reviewCount }: GrowthDetailSheetProps) {
  const currentInfo = STAGE_INFO[currentStage - 1]
  const nextInfo = currentStage < 5 ? STAGE_INFO[currentStage] : null

  // Progress within current stage
  const stageProgress = currentInfo.end !== undefined
    ? (reviewCount - currentInfo.start) / (currentInfo.end - currentInfo.start)
    : 1

  const remainingForNext = nextInfo
    ? Math.max(0, (currentInfo.end ?? 0) - reviewCount)
    : 0

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Pressable
        className="flex-1"
        onPress={onClose}
      >
        {/* Sheet — stop propagation so tapping inside doesn't close */}
        <Pressable
          className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl pb-8"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Handle bar */}
          <View className="items-center pt-3 pb-1">
            <View className="h-1 w-10 rounded-full bg-border" />
          </View>

          {/* Title */}
          <View className="px-6 pt-2 pb-4">
            <Text className="text-lg font-semibold text-foreground text-center">성장 단계 안내</Text>
          </View>

          {/* Stage rows */}
          <View className="px-4 gap-1">
            {STAGE_INFO.map(({ stage, label, range }) => {
              const isCurrent = stage === currentStage
              const isCompleted = stage < currentStage

              return (
                <View
                  key={stage}
                  className={cn(
                    'flex-row items-center gap-3 px-3 py-2 rounded-xl',
                    isCurrent && 'bg-seed/10'
                  )}
                >
                  <SeedCharacter stage={stage} size={40} />

                  <View className="flex-1">
                    <Text
                      className={cn(
                        'font-semibold text-sm',
                        isCurrent ? 'text-seed' : 'text-foreground'
                      )}
                    >
                      {label}
                    </Text>
                    <Text className="text-xs text-muted-foreground">{range}</Text>
                  </View>

                  {isCompleted && (
                    <View className="h-5 w-5 rounded-full bg-sprout items-center justify-center">
                      <Text className="text-white text-xs font-bold">✓</Text>
                    </View>
                  )}
                  {isCurrent && (
                    <View className="px-2 py-0.5 rounded-full bg-seed/20">
                      <Text className="text-xs font-medium text-seed">현재</Text>
                    </View>
                  )}
                </View>
              )
            })}
          </View>

          {/* Progress within current stage */}
          <View className="mx-4 mt-4 p-4 rounded-xl bg-secondary">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-medium text-foreground">
                {currentInfo.label}
                {nextInfo ? ` → ${nextInfo.label}` : ''}
              </Text>
              {currentInfo.end !== undefined && (
                <Text className="text-xs text-muted-foreground">
                  {reviewCount - currentInfo.start}/{currentInfo.end - currentInfo.start}회
                </Text>
              )}
            </View>
            <ProgressBar progress={stageProgress} />
            <Text className="text-xs text-muted-foreground mt-2 text-center">
              {currentStage === 5
                ? '모든 단계를 완료했어요!'
                : `다음 단계까지 ${remainingForNext}회 남았어요`}
            </Text>
          </View>

          {/* Close button */}
          <Pressable
            className="mx-4 mt-4 py-3 rounded-xl bg-seed items-center active:opacity-80"
            onPress={onClose}
          >
            <Text className="text-white font-semibold">닫기</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
