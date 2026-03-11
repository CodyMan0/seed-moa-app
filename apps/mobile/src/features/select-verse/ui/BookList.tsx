import * as React from 'react';
import { Pressable, SectionList, View } from 'react-native';

import type { BibleBook } from '@/entities/bible';
import { BIBLE_BOOKS } from '@/entities/bible';
import { Text } from '@/shared/components/ui/text';

type BookListProps = {
  onSelect: (book: BibleBook) => void;
};

const sections = [
  {
    title: '구약',
    data: BIBLE_BOOKS.filter((b) => b.testament === 'old'),
  },
  {
    title: '신약',
    data: BIBLE_BOOKS.filter((b) => b.testament === 'new'),
  },
];

export function BookList({ onSelect }: BookListProps) {
  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.name}
      renderSectionHeader={({ section }) => (
        <View className="bg-background px-2 py-3">
          <Text variant="large" className="text-foreground">
            {section.title}
          </Text>
        </View>
      )}
      renderItem={({ item }) => (
        <Pressable
          className="border-b border-border px-4 py-3.5 active:bg-accent"
          onPress={() => onSelect(item)}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-base text-foreground">{item.name}</Text>
            <Text variant="muted">{item.chapters}장</Text>
          </View>
        </Pressable>
      )}
      stickySectionHeadersEnabled
    />
  );
}
