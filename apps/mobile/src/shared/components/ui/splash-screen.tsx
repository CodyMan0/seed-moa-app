import * as React from 'react'
import { View } from 'react-native'
import { Text } from '@/shared/components/ui/text'
import { SeedCharacter } from '@/shared/components/ui/seed-character'

interface AppSplashScreenProps {
  onFinish: () => void
}

export function AppSplashScreen({ onFinish }: AppSplashScreenProps) {
  React.useEffect(() => {
    const timer = setTimeout(onFinish, 2000)
    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <View className="flex-1 bg-background items-center justify-center gap-6">
      <SeedCharacter stage={1} size={120} />
      <View className="items-center gap-2">
        <Text className="text-3xl font-bold text-foreground">씨앗모아</Text>
        <Text variant="muted" className="text-base">마음 밭에 말씀을 심어보세요</Text>
      </View>
    </View>
  )
}
