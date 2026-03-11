import * as React from 'react'
import { View } from 'react-native'
import { Text } from '@/shared/components/ui/text'
import { Button } from '@/shared/components/ui/button'

interface ReadModeProps {
  verseText: string
  reference: string
  onNext: () => void
}

export function ReadMode({ verseText, reference, onNext }: ReadModeProps) {
  return (
    <View className="flex-1 justify-center px-6 gap-8">
      <View className="items-center gap-2">
        <Text className="text-base text-seed font-semibold">
          {reference}
        </Text>
        <View className="w-12 h-0.5 bg-seed/40 rounded-full" />
      </View>

      <View className="rounded-2xl border border-border bg-card p-8">
        <Text className="text-xl leading-9 text-center text-foreground">
          {verseText}
        </Text>
      </View>

      <View className="items-center">
        <Text variant="muted" className="text-sm mb-4">
          말씀을 천천히 읽어보세요
        </Text>
        <Button className="w-full bg-primary" onPress={onNext}>
          <Text className="text-primary-foreground font-semibold">다음</Text>
        </Button>
      </View>
    </View>
  )
}
