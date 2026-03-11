import * as React from 'react';
import { FlatList, Pressable, View } from 'react-native';

import type { BibleBook } from '@/entities/bible';
import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/ui/text';

type ChapterGridProps = {
  book: BibleBook;
  onSelect: (chapter: number) => void;
  onBack: () => void;
};

export function ChapterGrid({ book, onSelect, onBack }: ChapterGridProps) {
  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);

  return (
    <View className="flex-1">
      <View className="flex-row items-center gap-3 px-2 pb-4">
        <Button variant="ghost" size="sm" onPress={onBack}>
          <Text>뒤로</Text>
        </Button>
        <Text variant="large" className="text-foreground">
          {book.name}
        </Text>
      </View>

      <FlatList
        data={chapters}
        numColumns={4}
        keyExtractor={(item) => String(item)}
        contentContainerClassName="gap-2 px-2"
        columnWrapperClassName="gap-2"
        renderItem={({ item }) => (
          <Pressable
            className="flex-1 items-center justify-center rounded-lg border border-border bg-card py-3.5 active:bg-accent"
            onPress={() => onSelect(item)}
          >
            <Text className="text-base text-foreground">{item}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
