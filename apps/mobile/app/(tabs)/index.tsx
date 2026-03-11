import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/ui/text';
import { router } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background px-6 py-8">
      <Text variant="h3" className="mb-6 text-foreground">
        오늘의 암송
      </Text>

      <View className="flex-1 items-center justify-center gap-6">
        <View className="w-full rounded-xl border border-border bg-card p-6">
          <Text variant="muted" className="text-center">
            아직 암송할 구절이 없습니다
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
    </View>
  );
}
