import { getMemorizeVerses } from '@/entities/memorize';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  SeedCharacter,
  getGrowthLabel,
  getGrowthStage,
} from '@/shared/components/ui/seed-character';
import { Text } from '@/shared/components/ui/text';
import { Button } from '@/shared/components/ui/button';
import { GroundBackground } from '@/shared/components/ui/ground-background';
import { useSession } from '@/shared/hooks/useSession';
import { supabase } from '@/shared/supabase/supabase';
import type { Database } from '@/shared/supabase/types';
import { router, useFocusEffect } from 'expo-router';
import * as React from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type MemorizeVerseRow = Database['public']['Tables']['memorize_verses']['Row'];

export default function MyVersesScreen() {
  const { session, isLoading: sessionLoading } = useSession();
  const [verses, setVerses] = React.useState<MemorizeVerseRow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchVerses = React.useCallback(async () => {
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }
    try {
      const data = await getMemorizeVerses(session.user.id);
      setVerses(data);
    } catch (error) {
      console.error('Failed to fetch verses:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [session?.user?.id]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchVerses();
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchVerses();
    }, [fetchVerses])
  );

  if (sessionLoading || isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="hsl(25 40% 64%)" />
      </View>
    );
  }

  const learningVerses = verses.filter((v) => v.status !== 'mastered');
  const masteredVerses = verses.filter((v) => v.status === 'mastered');

  const handleStatusToggle = async (verseId: string, newStatus: 'learning' | 'mastered') => {
    try {
      await supabase
        .from('memorize_verses')
        .update({ status: newStatus })
        .eq('id', verseId);
      fetchVerses();
    } catch (error) {
      console.error('Failed to update verse status:', error);
    }
  };

  const renderVerseCard = (verse: MemorizeVerseRow) => {
    const stage = getGrowthStage(verse.review_count, verse.status);
    const isMastered = verse.status === 'mastered';
    return (
      <Pressable key={verse.id} onPress={() => router.push(`/practice/${verse.id}`)}>
        <Card className="border-border">
          <CardContent className="gap-1 py-4">
            <View className="flex-row items-center gap-3">
              <SeedCharacter stage={stage} size={32} />
              <View className="flex-1 gap-1">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <Text className="font-semibold text-foreground">{verse.reference}</Text>
                    <Text className="text-xs text-muted-foreground">{getGrowthLabel(stage)}</Text>
                  </View>
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation?.();
                      handleStatusToggle(verse.id, isMastered ? 'learning' : 'mastered');
                    }}
                    className="px-2 py-1 rounded-md bg-secondary active:opacity-60"
                  >
                    <Text className="text-xs text-secondary-foreground">
                      {isMastered ? '다시 암송' : '완료'}
                    </Text>
                  </Pressable>
                </View>
                <Text variant="muted" numberOfLines={1}>
                  {verse.text}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <GroundBackground />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 py-6"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
      <View className="mb-6 flex-row items-center justify-between">
        <Text variant="h3" className="text-foreground">
          내 암송 구절
        </Text>
        <Text variant="muted">총 {verses.length}개</Text>
      </View>

      {verses.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <View className="w-full items-center gap-4 rounded-xl border border-border bg-card p-8">
            <SeedCharacter stage={1} size={48} />
            <Text variant="muted" className="text-center">
              아직 암송 중인 구절이 없습니다
            </Text>
          </View>
        </View>
      ) : (
        <View className="gap-6">
          {/* Learning section */}
          {learningVerses.length > 0 && (
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <View className="h-2 w-2 rounded-full bg-sprout" />
                <Text className="font-semibold text-foreground">
                  암송 중 ({learningVerses.length})
                </Text>
              </View>
              {learningVerses.map(renderVerseCard)}
            </View>
          )}

          {/* Mastered section */}
          {masteredVerses.length > 0 && (
            <View className="gap-3">
              <View className="flex-row items-center gap-2">
                <View className="h-2 w-2 rounded-full bg-bloom" />
                <Text className="font-semibold text-foreground">
                  완료 ({masteredVerses.length})
                </Text>
              </View>
              {masteredVerses.map(renderVerseCard)}
            </View>
          )}
        </View>
      )}
      </ScrollView>
    </SafeAreaView>
  );
}
