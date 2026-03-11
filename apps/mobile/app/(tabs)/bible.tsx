import * as React from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X } from 'lucide-react-native';
import { router } from 'expo-router';

import type { BibleBook } from '@/entities/bible';
import {
  requestNotificationPermissions,
  scheduleVerseReminders,
} from '@/features/notifications';
import { BookList, ChapterGrid, VerseList } from '@/features/select-verse';
import { Text } from '@/shared/components/ui/text';
import { supabase } from '@/shared/supabase/supabase';

type Step = 'books' | 'chapters' | 'verses';

export default function BibleScreen() {
  const [step, setStep] = React.useState<Step>('books');
  const [selectedBook, setSelectedBook] = React.useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = React.useState<number | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isAdding, setIsAdding] = React.useState(false);

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
    if (isAdding) return;
    setIsAdding(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        Alert.alert(
          '로그인 필요',
          '말씀을 암송 목록에 추가하려면\n로그인이 필요해요.',
          [
            { text: '취소', style: 'cancel' },
            {
              text: '로그인하기',
              onPress: () => router.push('/(auth)/login'),
            },
          ],
        );
        return;
      }

      const { data: existing } = await supabase
        .from('memorize_verses')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('reference', payload.reference)
        .limit(1);
      if (existing && existing.length > 0) {
        Alert.alert('알림', '이미 암송 목록에 있는 구절입니다.');
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

      // Schedule push notification reminders for the new verse
      const hasPermission = await requestNotificationPermissions();
      if (hasPermission) {
        // Query the inserted verse to get its ID
        const { data: insertedVerse } = await supabase
          .from('memorize_verses')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('reference', payload.reference)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (insertedVerse) {
          await scheduleVerseReminders(
            insertedVerse.id,
            payload.reference,
            payload.text,
          );
        }
      }

      Alert.alert('완료', `${payload.reference}이(가) 암송 목록에 추가되었습니다.`);
      setStep('books');
      setSelectedBook(null);
      setSelectedChapter(null);
    } catch {
      Alert.alert('오류', '네트워크 오류가 발생했습니다.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
    <View className="flex-1 px-4 pt-4">
      {step === 'books' && (
        <>
          <Text variant="h3" className="mb-1 px-2 text-foreground">
            성경
          </Text>
          <Text variant="muted" className="mb-3 px-2">
            구절을 선택하여 암송 목록에 추가하세요
          </Text>
          <View className="mb-3 flex-row items-center rounded-2xl bg-muted px-4">
            <Search size={18} color="hsl(30 16% 47%)" />
            <TextInput
              className="ml-2 h-12 flex-1 text-base text-foreground"
              placeholder="성경 이름으로 검색"
              placeholderTextColor="hsl(30 16% 47%)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <X size={18} color="hsl(30 16% 47%)" />
              </Pressable>
            )}
          </View>
          <BookList onSelect={handleSelectBook} filter={searchQuery} />
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
    </SafeAreaView>
  );
}
