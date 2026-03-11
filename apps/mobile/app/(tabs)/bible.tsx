import * as React from 'react';
import { Alert, View } from 'react-native';

import type { BibleBook } from '@/entities/bible';
import { BookList, ChapterGrid, VerseList } from '@/features/select-verse';
import { Text } from '@/shared/components/ui/text';
import { supabase } from '@/shared/supabase/supabase';

type Step = 'books' | 'chapters' | 'verses';

export default function BibleScreen() {
  const [step, setStep] = React.useState<Step>('books');
  const [selectedBook, setSelectedBook] = React.useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = React.useState<number | null>(null);

  const handleSelectBook = (book: BibleBook) => {
    setSelectedBook(book);
    setStep('chapters');
  };

  const handleSelectChapter = (chapter: number) => {
    setSelectedChapter(chapter);
    setStep('verses');
  };

  const handleBackToBooks = () => {
    setSelectedBook(null);
    setStep('books');
  };

  const handleBackToChapters = () => {
    setSelectedChapter(null);
    setStep('chapters');
  };

  const handleAddVerse = async (payload: {
    book: string;
    chapter: number;
    verseStart: number;
    verseEnd: number | null;
    text: string;
    reference: string;
  }) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        Alert.alert('오류', '로그인이 필요합니다.');
        return;
      }

      const { error } = await supabase.from('memorize_verses').insert({
        user_id: session.user.id,
        book: payload.book,
        chapter: payload.chapter,
        verse_start: payload.verseStart,
        verse_end: payload.verseEnd,
        text: payload.text,
        reference: payload.reference,
      });

      if (error) {
        Alert.alert('오류', '저장에 실패했습니다.');
        return;
      }

      Alert.alert('완료', `${payload.reference}이(가) 암송 목록에 추가되었습니다.`);
      setStep('books');
      setSelectedBook(null);
      setSelectedChapter(null);
    } catch {
      Alert.alert('오류', '네트워크 오류가 발생했습니다.');
    }
  };

  return (
    <View className="flex-1 bg-background px-4 pt-4">
      {step === 'books' && (
        <>
          <Text variant="h3" className="mb-1 px-2 text-foreground">
            성경
          </Text>
          <Text variant="muted" className="mb-4 px-2">
            구절을 선택하여 암송 목록에 추가하세요
          </Text>
          <BookList onSelect={handleSelectBook} />
        </>
      )}

      {step === 'chapters' && selectedBook && (
        <ChapterGrid
          book={selectedBook}
          onSelect={handleSelectChapter}
          onBack={handleBackToBooks}
        />
      )}

      {step === 'verses' && selectedBook && selectedChapter && (
        <VerseList
          book={selectedBook}
          chapter={selectedChapter}
          onBack={handleBackToChapters}
          onAddVerse={handleAddVerse}
        />
      )}
    </View>
  );
}
