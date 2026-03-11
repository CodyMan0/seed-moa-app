import * as React from 'react'
import { View, ScrollView, Pressable } from 'react-native'
import { Text } from '@/shared/components/ui/text'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/components/ui/lib/utils'

interface BlankModeProps {
  verseText: string
  reference: string
  onNext: () => void
}

interface WordSlot {
  word: string
  index: number
  isBlank: boolean
  filled: boolean
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function BlankMode({ verseText, reference, onNext }: BlankModeProps) {
  const words = React.useMemo(() => verseText.split(/\s+/), [verseText])

  const [slots, setSlots] = React.useState<WordSlot[]>(() => {
    const blankCount = Math.max(1, Math.round(words.length * 0.4))
    const indices = words.map((_, i) => i)
    const blankIndices = new Set(
      shuffleArray(indices).slice(0, blankCount)
    )

    return words.map((word, index) => ({
      word,
      index,
      isBlank: blankIndices.has(index),
      filled: false,
    }))
  })

  const [options, setOptions] = React.useState<string[]>(() =>
    shuffleArray(
      slots.filter((s) => s.isBlank).map((s) => s.word)
    )
  )

  const [incorrectCount, setIncorrectCount] = React.useState(0)

  const allFilled = slots.every((s) => !s.isBlank || s.filled)

  const currentBlankIndex = React.useMemo(
    () => slots.findIndex((s) => s.isBlank && !s.filled),
    [slots]
  )

  const handleOptionTap = (tappedWord: string, optionIndex: number) => {
    if (currentBlankIndex === -1) return

    const currentSlot = slots[currentBlankIndex]
    if (tappedWord === currentSlot.word) {
      setSlots((prev) =>
        prev.map((s, i) =>
          i === currentBlankIndex ? { ...s, filled: true } : s
        )
      )
      setOptions((prev) => prev.filter((_, i) => i !== optionIndex))
    } else {
      setIncorrectCount((prev) => prev + 1)
    }
  }

  return (
    <View className="flex-1 px-6 gap-6">
      <View className="items-center gap-2 pt-4">
        <Text className="text-base text-seed font-semibold">
          {reference}
        </Text>
        <View className="w-12 h-0.5 bg-seed/40 rounded-full" />
      </View>

      <ScrollView className="flex-1" contentContainerClassName="py-4">
        <View className="rounded-2xl border border-border bg-card p-6">
          <View className="flex-row flex-wrap gap-1.5">
            {slots.map((slot, i) => (
              <View key={i} className="py-1">
                {slot.isBlank && !slot.filled ? (
                  <View
                    className={cn(
                      'rounded-md border-2 border-dashed px-2 py-1 min-w-[48px] items-center',
                      i === currentBlankIndex
                        ? 'border-seed bg-seed/5'
                        : 'border-muted-foreground/30'
                    )}
                  >
                    <Text className="text-lg text-transparent">{slot.word}</Text>
                  </View>
                ) : (
                  <Text className="text-lg text-foreground">{slot.word}</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {!allFilled && (
          <View className="mt-6">
            <Text variant="muted" className="text-sm mb-3 text-center">
              빈칸에 들어갈 단어를 선택하세요
            </Text>
            <View className="flex-row flex-wrap gap-2 justify-center">
              {options.map((word, i) => (
                <Pressable
                  key={`${word}-${i}`}
                  className="rounded-lg border border-border bg-secondary px-4 py-2.5 active:bg-seed/20"
                  onPress={() => handleOptionTap(word, i)}
                >
                  <Text className="text-base text-secondary-foreground">{word}</Text>
                </Pressable>
              ))}
            </View>
            {incorrectCount > 0 && (
              <Text className="text-sm text-destructive text-center mt-3">
                틀린 횟수: {incorrectCount}
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      {allFilled && (
        <View className="pb-4">
          <Button className="w-full bg-primary" onPress={onNext}>
            <Text className="text-primary-foreground font-semibold">다음</Text>
          </Button>
        </View>
      )}
    </View>
  )
}
