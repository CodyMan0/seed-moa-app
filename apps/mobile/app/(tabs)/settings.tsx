import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/ui/text';
import { SeedCharacter, getGrowthLabel, getGrowthStage } from '@/shared/components/ui/seed-character';
import { GroundBackground } from '@/shared/components/ui/ground-background';
import { signOut } from '@/features/auth';
import { submitInquiry } from '@/features/inquiry';
import { requestNotificationPermissions, cancelAllReminders } from '@/features/notifications';
import { useSession } from '@/shared/hooks/useSession';
import { supabase } from '@/shared/supabase/supabase';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as React from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { GrowthStage } from '@/shared/components/ui/seed-character';
import {
  Bell,
  Check,
  ChevronRight,
  FileText,
  Info,
  LogOut,
  MessageCircle,
  Pencil,
  Shield,
  Target,
} from 'lucide-react-native';

function GuestView() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <GroundBackground />
      <View className="flex-1 items-center justify-center px-8">
        <View className="items-center gap-4">
          <SeedCharacter stage={1} size={120} />
          <Text variant="h3" className="text-center text-foreground">
            더보기 기능을 모두{'\n'}사용하려면
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

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  rightText?: string;
  onPress?: () => void;
  destructive?: boolean;
  isLast?: boolean;
}

function MenuItem({ icon, label, rightText, onPress, destructive, isLast }: MenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center px-4 py-3.5 ${!isLast ? 'border-b border-border' : ''}`}
    >
      <View className="mr-3 w-6 items-center">{icon}</View>
      <Text
        className={`flex-1 text-base ${destructive ? 'text-destructive' : 'text-foreground'}`}
      >
        {label}
      </Text>
      {rightText ? (
        <Text className="text-sm text-muted-foreground">{rightText}</Text>
      ) : (
        <ChevronRight size={18} className="text-muted-foreground" color="hsl(30 16% 47%)" />
      )}
    </Pressable>
  );
}

interface MenuSectionProps {
  title: string;
  children: React.ReactNode;
}

function MenuSection({ title, children }: MenuSectionProps) {
  return (
    <View className="mt-4">
      <Text className="mb-1.5 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {title}
      </Text>
      <View className="overflow-hidden rounded-2xl bg-card">{children}</View>
    </View>
  );
}

const GOAL_OPTIONS = [1, 3, 5, 10] as const;
const INQUIRY_CATEGORIES = ['기능 요청', '버그 신고', '기타 문의'] as const;

const ALL_REMINDER_HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22] as const;
const DEFAULT_HOURS = [9, 12, 15, 18];

function parseNotificationHours(raw: string | null): number[] {
  if (!raw) return DEFAULT_HOURS;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {}
  return DEFAULT_HOURS;
}

function formatHour(hour: number): string {
  if (hour < 12) return `오전 ${hour}시`;
  if (hour === 12) return `오후 12시`;
  return `오후 ${hour - 12}시`;
}

async function scheduleGlobalReminders(hours: number[]): Promise<void> {
  for (const h of ALL_REMINDER_HOURS) {
    await Notifications.cancelScheduledNotificationAsync(`global-reminder-${h}`).catch(() => {});
  }
  for (const hour of hours) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📖 말씀 암송 시간이에요',
        body: '오늘의 말씀을 암송해보세요!',
        data: { type: 'daily_reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute: 0,
      },
      identifier: `global-reminder-${hour}`,
    });
  }
}

async function cancelGlobalReminders(): Promise<void> {
  for (const h of ALL_REMINDER_HOURS) {
    await Notifications.cancelScheduledNotificationAsync(`global-reminder-${h}`).catch(() => {});
  }
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

  // Modal state
  const [showNotificationModal, setShowNotificationModal] = React.useState(false);
  const [showGoalModal, setShowGoalModal] = React.useState(false);
  const [notificationEnabled, setNotificationEnabled] = React.useState(false);
  const [notificationHours, setNotificationHours] = React.useState<number[]>(DEFAULT_HOURS);
  const [dailyGoal, setDailyGoal] = React.useState(3);
  const [isTogglingNotification, setIsTogglingNotification] = React.useState(false);
  const [isSavingHours, setIsSavingHours] = React.useState(false);
  const [isSavingGoal, setIsSavingGoal] = React.useState(false);
  const [showInquiryModal, setShowInquiryModal] = React.useState(false);
  const [inquiryCategory, setInquiryCategory] = React.useState('기능 요청');
  const [inquiryContent, setInquiryContent] = React.useState('');
  const [isSubmittingInquiry, setIsSubmittingInquiry] = React.useState(false);
  const [inquirySubmitted, setInquirySubmitted] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [showTermsModal, setShowTermsModal] = React.useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = React.useState(false);
  const [showNameModal, setShowNameModal] = React.useState(false);
  const [editNickname, setEditNickname] = React.useState('');
  const [isSavingName, setIsSavingName] = React.useState(false);

  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  React.useEffect(() => {
    if (!userId) return;

    async function fetchData() {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('nickname, notification_enabled, daily_goal, notification_time')
          .eq('id', userId!)
          .single();
        if (profile) {
          setNickname(profile.nickname);
          setNotificationEnabled(profile.notification_enabled ?? false);
          setNotificationHours(parseNotificationHours(profile.notification_time));
          setDailyGoal(profile.daily_goal ?? 3);
        }

        const { data: verses } = await supabase
          .from('memorize_verses')
          .select('status, review_count')
          .eq('user_id', userId!);

        const totalVerses = verses?.length ?? 0;
        const masteredCount = verses?.filter((v) => v.status === 'mastered').length ?? 0;

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

  const handleSignOut = () => {
    setShowLogoutModal(true);
  };

  const confirmSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      setShowLogoutModal(false);
      router.replace('/(auth)/login');
    } catch {
      Alert.alert('오류', '로그아웃 중 오류가 발생했습니다.');
    } finally {
      setIsSigningOut(false);
    }
  };

  const toggleNotification = async () => {
    if (isTogglingNotification) return;
    setIsTogglingNotification(true);
    try {
      const next = !notificationEnabled;
      if (next) {
        const granted = await requestNotificationPermissions();
        if (!granted) {
          Alert.alert('알림 권한 필요', '설정에서 알림 권한을 허용해주세요.');
          return;
        }
        await scheduleGlobalReminders(notificationHours);
      } else {
        await cancelGlobalReminders();
        await cancelAllReminders();
      }
      await supabase
        .from('profiles')
        .update({ notification_enabled: next })
        .eq('id', userId!);
      setNotificationEnabled(next);
    } catch {
      Alert.alert('오류', '알림 설정 중 오류가 발생했습니다.');
    } finally {
      setIsTogglingNotification(false);
    }
  };

  const toggleHour = async (hour: number) => {
    if (isSavingHours) return;
    setIsSavingHours(true);
    try {
      const updated = notificationHours.includes(hour)
        ? notificationHours.filter((h) => h !== hour)
        : [...notificationHours, hour].sort((a, b) => a - b);
      if (updated.length === 0) {
        Alert.alert('알림', '최소 1개의 알림 시간을 선택해주세요.');
        return;
      }
      await supabase
        .from('profiles')
        .update({ notification_time: JSON.stringify(updated) })
        .eq('id', userId!);
      setNotificationHours(updated);
      if (notificationEnabled) {
        await scheduleGlobalReminders(updated);
      }
    } catch {
      Alert.alert('오류', '알림 시간 변경에 실패했습니다.');
    } finally {
      setIsSavingHours(false);
    }
  };

  const handleGoalSelect = async (goal: number) => {
    if (isSavingGoal) return;
    setIsSavingGoal(true);
    try {
      await supabase
        .from('profiles')
        .update({ daily_goal: goal })
        .eq('id', userId!);
      setDailyGoal(goal);
      setShowGoalModal(false);
    } catch {
      Alert.alert('오류', '목표 설정 중 오류가 발생했습니다.');
    } finally {
      setIsSavingGoal(false);
    }
  };

  const handleSubmitInquiry = async () => {
    if (!inquiryContent.trim() || !userId) return;
    setIsSubmittingInquiry(true);
    try {
      await submitInquiry({
        userId,
        category: inquiryCategory,
        content: inquiryContent.trim(),
        email: userEmail ?? undefined,
      });
      setInquirySubmitted(true);
      setTimeout(() => {
        setInquirySubmitted(false);
        setInquiryContent('');
        setInquiryCategory('기능 요청');
        setShowInquiryModal(false);
      }, 1500);
    } catch {
      Alert.alert('오류', '문의 접수 중 오류가 발생했습니다.');
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  const handleSaveName = async () => {
    if (!editNickname.trim()) {
      Alert.alert('알림', '이름을 입력해주세요.');
      return;
    }
    setIsSavingName(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ nickname: editNickname.trim() })
        .eq('id', userId!);
      if (error) throw error;
      setNickname(editNickname.trim());
      setShowNameModal(false);
    } catch (e: any) {
      Alert.alert('오류', '이름 변경에 실패했습니다.');
    } finally {
      setIsSavingName(false);
    }
  };

  const growthStage: GrowthStage = getGrowthStage(stats.masteredCount * 4, undefined);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <GroundBackground />
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <GroundBackground />
      <ScrollView className="flex-1" contentContainerClassName="px-6 py-6">
        {/* Profile Card */}
        <Pressable
          className="items-center rounded-2xl bg-card p-6"
          onPress={() => {
            setEditNickname(nickname ?? '');
            setShowNameModal(true);
          }}
        >
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
        </Pressable>

        {/* Stats Row */}
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

        {/* 암송 관리 */}
        <MenuSection title="암송 관리">
          <MenuItem
            icon={<Pencil size={18} color="hsl(30 36% 17%)" />}
            label="이름 변경"
            rightText={nickname ?? '사용자'}
            onPress={() => {
              setEditNickname(nickname ?? '');
              setShowNameModal(true);
            }}
          />
          <MenuItem
            icon={<Bell size={18} color="hsl(30 36% 17%)" />}
            label="알림 설정"
            rightText={notificationEnabled ? `${notificationHours.length}개 시간` : '꺼짐'}
            onPress={() => setShowNotificationModal(true)}
          />
          <MenuItem
            icon={<Target size={18} color="hsl(30 36% 17%)" />}
            label="목표 설정"
            rightText={`${dailyGoal}개`}
            onPress={() => setShowGoalModal(true)}
            isLast
          />
        </MenuSection>

        {/* 앱 정보 */}
        <MenuSection title="앱 정보">
          <MenuItem
            icon={<Info size={18} color="hsl(30 36% 17%)" />}
            label="앱 버전"
            rightText="1.0.0"
          />
          <MenuItem
            icon={<MessageCircle size={18} color="hsl(30 36% 17%)" />}
            label="문의하기"
            onPress={() => setShowInquiryModal(true)}
          />
          <MenuItem
            icon={<FileText size={18} color="hsl(30 36% 17%)" />}
            label="이용약관"
            onPress={() => router.push('/terms')}
          />
          <MenuItem
            icon={<Shield size={18} color="hsl(30 36% 17%)" />}
            label="개인정보처리방침"
            onPress={() => router.push('/privacy')}
            isLast
          />
        </MenuSection>

        {/* 계정 */}
        <MenuSection title="계정">
          <MenuItem
            icon={
              isSigningOut ? (
                <ActivityIndicator size="small" />
              ) : (
                <LogOut size={18} color="hsl(0 84% 60%)" />
              )
            }
            label="로그아웃"
            onPress={handleSignOut}
            destructive
            isLast
          />
        </MenuSection>
      </ScrollView>

      {/* 알림 설정 Modal */}
      <Modal
        visible={showNotificationModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowNotificationModal(false)}
      >
        <Pressable
          className="flex-1 justify-end"
          onPress={() => setShowNotificationModal(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View className="rounded-t-3xl bg-background px-6 pb-10 pt-6">
              {/* Handle bar */}
              <View className="mb-6 items-center">
                <View className="h-1 w-10 rounded-full bg-muted-foreground/30" />
              </View>

              <Text variant="h3" className="mb-6 text-foreground">
                알림 설정
              </Text>

              <View className="flex-row items-center justify-between py-4">
                <Text className="text-base text-foreground">암송 알림</Text>
                <Pressable
                  onPress={toggleNotification}
                  disabled={isTogglingNotification}
                  className={`h-8 w-14 justify-center rounded-full ${notificationEnabled ? 'bg-primary' : 'bg-muted'}`}
                >
                  <View
                    className={`h-6 w-6 rounded-full bg-white shadow ${notificationEnabled ? 'ml-7' : 'ml-1'}`}
                  />
                </Pressable>
              </View>

              {notificationEnabled && (
                <View className="mt-4">
                  <Text className="mb-3 text-sm font-medium text-foreground">
                    알림 시간 선택
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {ALL_REMINDER_HOURS.map((hour) => {
                      const selected = notificationHours.includes(hour);
                      return (
                        <Pressable
                          key={hour}
                          onPress={() => toggleHour(hour)}
                          disabled={isSavingHours}
                          className={`rounded-full px-3 py-2 ${
                            selected ? 'bg-primary' : 'bg-secondary'
                          }`}
                        >
                          <Text
                            className={`text-xs font-medium ${
                              selected ? 'text-primary-foreground' : 'text-secondary-foreground'
                            }`}
                          >
                            {formatHour(hour)}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  <Text variant="muted" className="mt-3 text-xs">
                    선택한 시간에 매일 알림을 보내드려요
                  </Text>
                </View>
              )}

              <Button
                variant="outline"
                size="lg"
                className="mt-6 w-full"
                onPress={() => setShowNotificationModal(false)}
              >
                <Text className="font-semibold text-foreground">닫기</Text>
              </Button>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* 목표 설정 Modal */}
      <Modal
        visible={showGoalModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowGoalModal(false)}
      >
        <Pressable
          className="flex-1 justify-end"
          onPress={() => setShowGoalModal(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View className="rounded-t-3xl bg-background px-6 pb-10 pt-6">
              {/* Handle bar */}
              <View className="mb-6 items-center">
                <View className="h-1 w-10 rounded-full bg-muted-foreground/30" />
              </View>

              <Text variant="h3" className="mb-2 text-foreground">
                목표 설정
              </Text>
              <Text variant="muted" className="mb-6 text-sm">
                하루에 암송할 구절 수를 선택해주세요
              </Text>

              <View className="gap-3">
                {GOAL_OPTIONS.map((goal) => {
                  const selected = dailyGoal === goal;
                  return (
                    <Pressable
                      key={goal}
                      onPress={() => handleGoalSelect(goal)}
                      disabled={isSavingGoal}
                      className={`rounded-2xl border p-4 ${
                        selected
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-card'
                      }`}
                    >
                      <Text
                        className={`text-base font-semibold ${selected ? 'text-primary' : 'text-foreground'}`}
                      >
                        {goal}개
                      </Text>
                      <Text variant="muted" className="mt-0.5 text-sm">
                        하루 {goal}구절 암송
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Button
                variant="outline"
                size="lg"
                className="mt-6 w-full"
                onPress={() => setShowGoalModal(false)}
              >
                <Text className="font-semibold text-foreground">닫기</Text>
              </Button>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* 이름 변경 Modal */}
      <Modal visible={showNameModal} transparent animationType="slide" onRequestClose={() => setShowNameModal(false)}>
        <Pressable className="flex-1 justify-end" onPress={() => setShowNameModal(false)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View className="rounded-t-3xl bg-background px-6 pb-10 pt-6">
              <View className="mb-6 items-center">
                <View className="h-1 w-10 rounded-full bg-muted-foreground/30" />
              </View>
              <Text variant="h3" className="mb-4 text-foreground">이름 변경</Text>
              <TextInput
                className="h-14 rounded-2xl bg-muted px-4 text-base text-foreground"
                placeholder="새 이름 (닉네임)"
                placeholderTextColor="hsl(30 16% 47%)"
                value={editNickname}
                onChangeText={setEditNickname}
                autoFocus
              />
              <Button
                className="mt-4 w-full bg-sprout"
                size="lg"
                onPress={handleSaveName}
                disabled={isSavingName}
              >
                {isSavingName ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="font-semibold text-white">저장</Text>
                )}
              </Button>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* 문의하기 Modal */}
      <Modal
        visible={showInquiryModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowInquiryModal(false)}
      >
        <Pressable
          className="flex-1 justify-end"
          onPress={() => setShowInquiryModal(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View className="rounded-t-3xl bg-background px-6 pb-10 pt-6">
              <View className="mb-6 items-center">
                <View className="h-1 w-10 rounded-full bg-muted-foreground/30" />
              </View>

              {inquirySubmitted ? (
                <View className="items-center py-10 gap-4">
                  <View className="h-16 w-16 rounded-full bg-sprout/20 items-center justify-center">
                    <Check size={32} color="hsl(120 30% 40%)" />
                  </View>
                  <Text className="text-lg font-semibold text-foreground">문의가 접수되었어요</Text>
                  <Text variant="muted" className="text-sm">빠르게 답변 드릴게요!</Text>
                </View>
              ) : (
                <>
                  <Text variant="h3" className="mb-2 text-foreground">문의하기</Text>
                  <Text variant="muted" className="mb-6 text-sm">불편한 점이나 개선 사항을 알려주세요</Text>

                  {/* Category selector */}
                  <View className="flex-row gap-2 mb-4">
                    {INQUIRY_CATEGORIES.map((cat) => (
                      <Pressable
                        key={cat}
                        onPress={() => setInquiryCategory(cat)}
                        className={`rounded-full px-3 py-1.5 ${
                          inquiryCategory === cat
                            ? 'bg-primary'
                            : 'bg-secondary'
                        }`}
                      >
                        <Text
                          className={`text-sm ${
                            inquiryCategory === cat
                              ? 'text-primary-foreground font-medium'
                              : 'text-secondary-foreground'
                          }`}
                        >
                          {cat}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  {/* Content input */}
                  <TextInput
                    value={inquiryContent}
                    onChangeText={setInquiryContent}
                    placeholder="내용을 입력해주세요"
                    placeholderTextColor="hsl(30 16% 47%)"
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                    className="rounded-xl border border-border bg-card p-4 text-base text-foreground mb-4"
                    style={{ minHeight: 120 }}
                  />

                  <Button
                    size="lg"
                    className="w-full bg-primary"
                    onPress={handleSubmitInquiry}
                    disabled={!inquiryContent.trim() || isSubmittingInquiry}
                  >
                    <Text className="font-semibold text-primary-foreground">
                      {isSubmittingInquiry ? '접수 중...' : '문의 보내기'}
                    </Text>
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                size="lg"
                className="mt-3 w-full"
                onPress={() => setShowInquiryModal(false)}
              >
                <Text className="font-semibold text-foreground">닫기</Text>
              </Button>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* 로그아웃 확인 Modal */}
      <Modal
        visible={showLogoutModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <Pressable
          className="flex-1 justify-end"
          onPress={() => setShowLogoutModal(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View className="rounded-t-3xl bg-white px-6 pb-10 pt-6">
              <View className="mb-6 items-center">
                <View className="h-1 w-10 rounded-full bg-muted-foreground/30" />
              </View>

              <View className="items-center gap-2 mb-6">
                <Text className="text-lg font-semibold text-foreground">로그아웃</Text>
                <Text className="text-sm text-muted-foreground">정말 로그아웃 하시겠어요?</Text>
              </View>

              <Button
                size="lg"
                className="w-full"
                style={{ backgroundColor: 'hsl(0 50% 65%)' }}
                onPress={confirmSignOut}
                disabled={isSigningOut}
              >
                <Text className="font-semibold text-white">
                  {isSigningOut ? '로그아웃 중...' : '로그아웃'}
                </Text>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="mt-3 w-full border-border"
                onPress={() => setShowLogoutModal(false)}
              >
                <Text className="font-semibold text-foreground">취소</Text>
              </Button>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

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
