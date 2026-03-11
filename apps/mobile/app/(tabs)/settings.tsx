import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/ui/text';
import { SeedCharacter } from '@/shared/components/ui/seed-character';
import { signOut } from '@/features/auth';
import { useSession } from '@/shared/hooks/useSession';
import { supabase } from '@/shared/supabase/supabase';
import { router } from 'expo-router';
import * as React from 'react';
import { ActivityIndicator, Alert, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { GrowthStage } from '@/shared/components/ui/seed-character';
import { getGrowthLabel, getGrowthStage } from '@/shared/components/ui/seed-character';

function GuestView() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-8">
        <View className="items-center gap-4">
          <SeedCharacter stage={1} size={120} />
          <Text variant="h3" className="text-center text-foreground">
            씨앗모아의 모든 기능을{'\n'}사용하려면
          </Text>
          <Text variant="muted" className="text-center">
            회원가입이 필요해요
          </Text>
        </View>

        <View className="mt-8 w-full gap-3">
          <Button
            size="lg"
            className="w-full bg-primary"
            onPress={() => router.push('/(auth)/signup')}
          >
            <Text className="font-semibold text-primary-foreground">회원가입</Text>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onPress={() => router.push('/(auth)/login')}
          >
            <Text className="font-semibold text-foreground">로그인</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

function LoggedInView() {
  const { session } = useSession();
  const [nickname, setNickname] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState({
    totalVerses: 0,
    masteredCount: 0,
    currentStreak: 0,
  });
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  React.useEffect(() => {
    if (!userId) return;

    async function fetchData() {
      try {
        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('nickname')
          .eq('id', userId!)
          .single();
        if (profile) setNickname(profile.nickname);

        // Fetch verse stats
        const { data: verses } = await supabase
          .from('memorize_verses')
          .select('status, review_count')
          .eq('user_id', userId!);

        const totalVerses = verses?.length ?? 0;
        const masteredCount = verses?.filter((v) => v.status === 'mastered').length ?? 0;

        // Fetch streak
        const { data: streak } = await supabase
          .from('user_streaks')
          .select('current_streak')
          .eq('id', userId!)
          .single();

        setStats({
          totalVerses,
          masteredCount,
          currentStreak: streak?.current_streak ?? 0,
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  const handleSignOut = async () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠어요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          setIsSigningOut(true);
          try {
            await signOut();
            router.replace('/(auth)/login');
          } catch {
            Alert.alert('오류', '로그아웃 중 오류가 발생했습니다.');
          } finally {
            setIsSigningOut(false);
          }
        },
      },
    ]);
  };

  const growthStage: GrowthStage = getGrowthStage(stats.masteredCount * 4, undefined);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 py-6"
      >
        {/* Profile Section */}
        <View className="items-center rounded-2xl bg-card p-6">
          <SeedCharacter stage={growthStage} size={100} />
          <Text variant="h3" className="mt-3 text-foreground">
            {nickname ?? '사용자'}
          </Text>
          <Text variant="muted" className="mt-1">
            {userEmail}
          </Text>
          <View className="mt-3 rounded-full bg-primary/10 px-4 py-1.5">
            <Text className="text-sm font-medium text-primary">
              현재 레벨: {getGrowthLabel(growthStage)}
            </Text>
          </View>
        </View>

        {/* Stats Section */}
        <View className="mt-4 flex-row gap-3">
          <View className="flex-1 items-center rounded-2xl bg-card p-4">
            <Text variant="h3" className="text-foreground">
              {stats.totalVerses}
            </Text>
            <Text variant="muted" className="mt-1">
              전체 말씀
            </Text>
          </View>
          <View className="flex-1 items-center rounded-2xl bg-card p-4">
            <Text variant="h3" className="text-foreground">
              {stats.masteredCount}
            </Text>
            <Text variant="muted" className="mt-1">
              암기 완료
            </Text>
          </View>
          <View className="flex-1 items-center rounded-2xl bg-card p-4">
            <Text variant="h3" className="text-foreground">
              {stats.currentStreak}
            </Text>
            <Text variant="muted" className="mt-1">
              연속 일수
            </Text>
          </View>
        </View>

        {/* Sign Out */}
        <View className="mt-8">
          <Button
            variant="outline"
            size="lg"
            className="w-full border-destructive/30"
            onPress={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <ActivityIndicator size="small" />
            ) : (
              <Text className="font-semibold text-destructive">로그아웃</Text>
            )}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function SettingsScreen() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!session) {
    return <GuestView />;
  }

  return <LoggedInView />;
}
