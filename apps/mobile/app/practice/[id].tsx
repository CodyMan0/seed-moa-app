import { Text } from '@/shared/components/ui/text';
import { Button } from '@/shared/components/ui/button';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PracticeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <View className="flex-1 items-center justify-center px-6 gap-6">
        <Text variant="h3" className="text-foreground">
          암송 연습
        </Text>

        <View className="w-full rounded-xl border border-border bg-card p-8">
          <Text variant="muted" className="text-center">
            준비 중입니다
          </Text>
        </View>

        <Button variant="outline" className="w-full" onPress={() => router.back()}>
          <Text>돌아가기</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
