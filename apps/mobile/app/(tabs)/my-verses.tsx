import { Text } from '@/shared/components/ui/text';
import * as React from 'react';
import { View } from 'react-native';

export default function MyVersesScreen() {
  return (
    <View className="flex-1 bg-background px-6 py-8">
      <Text variant="h3" className="mb-6 text-foreground">
        내 암송 구절
      </Text>

      <View className="flex-1 items-center justify-center">
        <View className="w-full rounded-xl border border-border bg-card p-8">
          <Text variant="muted" className="text-center">
            아직 암송 중인 구절이 없습니다
          </Text>
        </View>
      </View>
    </View>
  );
}
