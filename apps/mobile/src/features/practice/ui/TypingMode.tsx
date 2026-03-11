import * as React from 'react'
import { View, TextInput, ScrollView } from 'react-native'
import { Text } from '@/shared/components/ui/text'
import { Button } from '@/shared/components/ui/button'

interface TypingModeProps {
  verseText: string
  reference: string
  onNext: () => void
}

interface ComparisonPart {
  text: string
  correct: boolean
}

function compareTexts(input: string, answer: string): ComparisonPart[] {
  const inputWords = input.trim().split(/\s+/)
  const answerWords = answer.trim().split(/\s+/)
  const parts: ComparisonPart[] = []

  const maxLen = Math.max(inputWords.length, answerWords.length)
  for (let i = 0; i < maxLen; i++) {
    const inputWord = inputWords[i] ?? ''
    const answerWord = answerWords[i] ?? ''
    parts.push({
      text: inputWord || answerWord,
      correct: inputWord === answerWord,
    })
  }

  return parts
}

export function TypingMode({ verseText, reference, onNext }: TypingModeProps) {
  const [input, setInput] = React.useState('')
  const [checked, setChecked] = React.useState(false)
  const [comparison, setComparison] = React.useState<ComparisonPart[]>([])

  const handleCheck = () => {
    const result = compareTexts(input, verseText)
    setComparison(result)
    setChecked(true)
  }

  const allCorrect = checked && comparison.every((p) => p.correct)

  return (
    <View className="flex-1 px-6 gap-6">
      <View className="items-center gap-2 pt-4">
        <Text className="text-base text-seed font-semibold">
          {reference}
        </Text>
        <View className="w-12 h-0.5 bg-seed/40 rounded-full" />
      </View>

      <ScrollView className="flex-1" contentContainerClassName="py-4 gap-6">
        {!checked ? (
          <>
            <Text variant="muted" className="text-sm text-center">
              말씀을 기억나는 대로 입력하세요
            </Text>
            <TextInput
              className="rounded-2xl border border-border bg-card p-6 text-lg leading-8 text-foreground min-h-[160px]"
              multiline
              textAlignVertical="top"
              placeholder="여기에 입력하세요..."
              placeholderTextColor="hsl(30 16% 47%)"
              value={input}
              onChangeText={setInput}
              autoFocus
            />
          </>
        ) : (
          <>
            <View className="rounded-2xl border border-border bg-card p-6">
              <Text variant="muted" className="text-sm mb-3">
                내가 입력한 내용
              </Text>
              <View className="flex-row flex-wrap gap-1">
                {comparison.map((part, i) => (
                  <Text
                    key={i}
                    className={
                      part.correct
                        ? 'text-lg text-sprout'
                        : 'text-lg text-destructive line-through'
                    }
                  >
                    {part.text}
                  </Text>
                ))}
              </View>
            </View>

            <View className="rounded-2xl border border-border bg-card p-6">
              <Text variant="muted" className="text-sm mb-3">
                정답
              </Text>
              <Text className="text-lg leading-8 text-foreground">
                {verseText}
              </Text>
            </View>

            {allCorrect && (
              <View className="items-center py-2">
                <Text className="text-lg font-semibold text-sprout">
                  정확하게 입력했습니다!
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <View className="pb-4">
        {!checked ? (
          <Button
            className="w-full bg-primary"
            onPress={handleCheck}
            disabled={input.trim().length === 0}
          >
            <Text className="text-primary-foreground font-semibold">확인</Text>
          </Button>
        ) : (
          <Button className="w-full bg-primary" onPress={onNext}>
            <Text className="text-primary-foreground font-semibold">다음</Text>
          </Button>
        )}
      </View>
    </View>
  )
}
