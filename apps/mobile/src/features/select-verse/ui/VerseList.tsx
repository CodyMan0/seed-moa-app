import * as React from 'react';
import { FlatList, Pressable, View } from 'react-native';

import type { BibleBook, BibleVerse } from '@/entities/bible';
import { formatReference, getVerses, loadBibleData } from '@/entities/bible';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Text } from '@/shared/components/ui/text';

type AddVersePayload = {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number | null;
  text: string;
  reference: string;
};

type VerseListProps = {
  book: BibleBook;
  chapter: number;
  onBack: () => void;
  onAddVerse: (payload: AddVersePayload) => void;
};

export function VerseList({ book, chapter, onBack, onAddVerse }: VerseListProps) {
  const [verses, setVerses] = React.useState<BibleVerse[]>([]);
  const [verseStart, setVerseStart] = React.useState<number | null>(null);
  const [verseEnd, setVerseEnd] = React.useState<number | null>(null);

  React.useEffect(() => {
    async function load() {
      await loadBibleData();
      setVerses(getVerses(book.name, chapter));
    }
    load();
  }, [book.name, chapter]);

  const handleVersePress = (verseNum: number) => {
    if (verseStart === null) {
      setVerseStart(verseNum);
      setVerseEnd(null);
    } else if (verseEnd === null && verseNum !== verseStart) {
      const start = Math.min(verseStart, verseNum);
      const end = Math.max(verseStart, verseNum);
      setVerseStart(start);
      setVerseEnd(end);
    } else {
      setVerseStart(verseNum);
      setVerseEnd(null);
    }
  };

  const isSelected = (verseNum: number) => {
    if (verseStart === null) return false;
    if (verseEnd === null) return verseNum === verseStart;
    return verseNum >= verseStart && verseNum <= verseEnd;
  };

  const selectedVerses = React.useMemo(() => {
    if (verseStart === null) return [];
    const end = verseEnd ?? verseStart;
    return verses.filter((v) => v.verse >= verseStart && v.verse <= end);
  }, [verses, verseStart, verseEnd]);

  const selectedText = selectedVerses.map((v) => v.text).join(' ');

  const reference = verseStart !== null
    ? formatReference({
        book: book.name,
        chapter,
        verseStart,
        verseEnd: verseEnd ?? undefined,
      })
    : '';

  const handleAdd = () => {
    if (verseStart === null) return;
    onAddVerse({
      book: book.name,
      chapter,
      verseStart,
      verseEnd: verseEnd,
      text: selectedText,
      reference,
    });
  };

  return (
    <View className="flex-1">
      <View className="flex-row items-center gap-3 px-2 pb-4">
        <Button variant="ghost" size="sm" onPress={onBack}>
          <Text>뒤로</Text>
        </Button>
        <Text variant="large" className="text-foreground">
          {book.name} {chapter}장
        </Text>
      </View>

      <FlatList
        data={verses}
        keyExtractor={(item) => String(item.verse)}
        contentContainerClassName="px-2 pb-48"
        renderItem={({ item }) => (
          <Pressable
            className={`flex-row gap-2 rounded-md px-3 py-2.5 ${
              isSelected(item.verse) ? 'bg-primary/10' : 'active:bg-accent'
            }`}
            onPress={() => handleVersePress(item.verse)}
          >
            <Text
              variant="small"
              className={`min-w-[24px] pt-0.5 ${
                isSelected(item.verse) ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {item.verse}
            </Text>
            <Text
              className={`flex-1 text-sm leading-5 ${
                isSelected(item.verse) ? 'text-primary' : 'text-foreground'
              }`}
              numberOfLines={2}
            >
              {item.text}
            </Text>
          </Pressable>
        )}
      />

      {verseStart !== null && (
        <View className="absolute bottom-0 left-0 right-0 bg-background px-4 pb-8 pt-3">
          <Card className="mb-3">
            <CardContent className="p-4">
              <Text variant="small" className="mb-2 text-primary">
                {reference}
              </Text>
              <Text className="text-sm leading-5 text-foreground" numberOfLines={4}>
                {selectedText}
              </Text>
            </CardContent>
          </Card>
          <Button onPress={handleAdd}>
            <Text>암송 목록에 추가</Text>
          </Button>
        </View>
      )}
    </View>
  );
}
