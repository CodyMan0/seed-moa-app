import * as React from 'react'
import { View } from 'react-native'
import { Text } from '@/shared/components/ui/text'
import { Button } from '@/shared/components/ui/button'
import { getInitialHint } from '@/entities/bible/lib/helpers'

interface InitialModeProps {
  verseText: string
  reference: string
  onNext: () => void
}

export function InitialMode({ verseText, reference, onNext }: InitialModeProps) {
  const [revealed, setRevealed] = React.useState(false)
  const hintText = React.useMemo(() => getInitialHint(verseText), [verseText])

  return (
    <View className="flex-1 justify-center px-6 gap-8">
      <View className="items-center gap-2">
        <Text variant="muted" className="text-base">
          {reference}
        </Text>
        <View className="w-12 h-0.5 bg-border rounded-full" />
      </View>

      <View className="rounded-2xl border border-border bg-card p-8">
        <Text className="text-xl leading-9 text-center text-foreground">
          {revealed ? verseText : hintText}
        </Text>
      </View>

      <View className="items-center gap-3">
        {!revealed ? (
          <>
            <Text variant="muted" className="text-sm">
              초성을 보고 말씀을 떠올려 보세요
            </Text>
            <Button variant="outline" className="w-full" onPress={() => setRevealed(true)}>
              <Text>정답 보기</Text>
            </Button>
          </>
        ) : (
          <Button className="w-full" onPress={onNext}>
            <Text>다음</Text>
          </Button>
        )}
      </View>
    </View>
  )
}
