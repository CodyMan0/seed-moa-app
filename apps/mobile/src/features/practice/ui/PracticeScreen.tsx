import * as React from 'react'
import { View } from 'react-native'
import { Text } from '@/shared/components/ui/text'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/components/ui/lib/utils'
import type { PracticeMode } from '@/entities/memorize/model/types'
import { ReadMode } from './ReadMode'
import { InitialMode } from './InitialMode'
import { BlankMode } from './BlankMode'
import { TypingMode } from './TypingMode'

interface PracticeScreenProps {
  verseText: string
  reference: string
  onComplete: (quality: number) => void
}

const MODES: PracticeMode[] = ['read', 'initial', 'blank', 'typing']

const MODE_LABELS: Record<PracticeMode, string> = {
  read: '전체보기',
  initial: '초성 힌트',
  blank: '빈칸 채우기',
  typing: '직접 타이핑',
}

interface QualityOption {
  label: string
  quality: number
  className: string
  textClassName: string
}

const QUALITY_OPTIONS: QualityOption[] = [
  { label: '어려웠어요', quality: 2, className: 'bg-bloom-light', textClassName: 'text-white' },
  { label: '보통이에요', quality: 3, className: 'bg-seed', textClassName: 'text-white' },
  { label: '쉬웠어요', quality: 5, className: 'bg-sprout', textClassName: 'text-white' },
]

export function PracticeScreen({ verseText, reference, onComplete }: PracticeScreenProps) {
  const [modeIndex, setModeIndex] = React.useState(0)
  const [showRating, setShowRating] = React.useState(false)

  const currentMode = MODES[modeIndex]
  const progress = showRating ? MODES.length : modeIndex

  const handleNext = () => {
    if (modeIndex < MODES.length - 1) {
      setModeIndex((prev) => prev + 1)
    } else {
      setShowRating(true)
    }
  }

  const handleRate = (quality: number) => {
    onComplete(quality)
  }

  return (
    <View className="flex-1 bg-background">
      {/* Progress indicator */}
      <View className="px-6 pt-4 gap-3">
        <View className="flex-row gap-2">
          {MODES.map((mode, i) => (
            <View
              key={mode}
              className={cn(
                'flex-1 h-1.5 rounded-full',
                i < progress
                  ? 'bg-sprout'
                  : i === progress && !showRating
                    ? 'bg-seed'
                    : 'bg-muted'
              )}
            />
          ))}
        </View>
        {!showRating && (
          <Text variant="muted" className="text-sm text-center">
            {modeIndex + 1}/{MODES.length} - {MODE_LABELS[currentMode]}
          </Text>
        )}
      </View>

      {/* Mode content */}
      {showRating ? (
        <View className="flex-1 justify-center px-6 gap-8">
          <View className="items-center gap-3">
            <Text variant="h3" className="text-foreground">
              연습 완료
            </Text>
            <Text variant="muted" className="text-center">
              이 말씀의 난이도를 평가해 주세요
            </Text>
          </View>

          <View className="gap-3">
            {QUALITY_OPTIONS.map((option) => (
              <Button
                key={option.quality}
                size="lg"
                className={cn('w-full', option.className)}
                onPress={() => handleRate(option.quality)}
              >
                <Text className={cn('font-semibold', option.textClassName)}>{option.label}</Text>
              </Button>
            ))}
          </View>
        </View>
      ) : currentMode === 'read' ? (
        <ReadMode verseText={verseText} reference={reference} onNext={handleNext} />
      ) : currentMode === 'initial' ? (
        <InitialMode verseText={verseText} reference={reference} onNext={handleNext} />
      ) : currentMode === 'blank' ? (
        <BlankMode verseText={verseText} reference={reference} onNext={handleNext} />
      ) : (
        <TypingMode verseText={verseText} reference={reference} onNext={handleNext} />
      )}
    </View>
  )
}
