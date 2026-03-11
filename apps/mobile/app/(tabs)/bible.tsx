import { Text } from '@/shared/components/ui/text';
import * as React from 'react';
import { View } from 'react-native';

export default function BibleScreen() {
  return (
    <View className="flex-1 bg-background px-6 py-8">
      <Text variant="h3" className="mb-2 text-foreground">
        성경
      </Text>
      <Text variant="muted" className="mb-8">
        구절을 선택하여 암송 목록에 추가하세요
      </Text>

      <View className="flex-1 items-center justify-center">
        <Text variant="muted">준비 중입니다</Text>
      </View>
    </View>
  );
}
