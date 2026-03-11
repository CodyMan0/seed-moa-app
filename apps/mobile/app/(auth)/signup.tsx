import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/ui/text';
import { SeedCharacter } from '@/shared/components/ui/seed-character';
import { signUpWithEmail } from '@/features/auth';
import { supabase } from '@/shared/supabase/supabase';
import { Link, router } from 'expo-router';
import * as React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { GrowthStage } from '@/shared/components/ui/seed-character';

type Step = 1 | 2 | 3;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ProgressDots({ currentStep }: { currentStep: Step }) {
  return (
    <View className="flex-row items-center gap-2">
      {([1, 2, 3] as const).map((step) => (
        <View
          key={step}
          className={`h-2.5 rounded-full ${
            step === currentStep
              ? 'w-6 bg-primary'
              : step < currentStep
                ? 'w-2.5 bg-sprout'
                : 'w-2.5 bg-border'
          }`}
        />
      ))}
    </View>
  );
}

export default function SignupScreen() {
  const [step, setStep] = React.useState<Step>(1);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordConfirm, setPasswordConfirm] = React.useState('');
  const [nickname, setNickname] = React.useState('');
  const [birthYear, setBirthYear] = React.useState('');
  const [birthMonth, setBirthMonth] = React.useState('');
  const [birthDay, setBirthDay] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const seedStage: GrowthStage = step as GrowthStage;

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!email.trim()) {
        setError('이메일을 입력해주세요.');
        return;
      }
      if (!EMAIL_REGEX.test(email.trim())) {
        setError('올바른 이메일 형식을 입력해주세요.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!password) {
        setError('비밀번호를 입력해주세요.');
        return;
      }
      if (password.length < 6) {
        setError('비밀번호는 6자 이상이어야 합니다.');
        return;
      }
      if (password !== passwordConfirm) {
        setError('비밀번호가 일치하지 않습니다.');
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    setError(null);
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const handleSignup = async () => {
    setError(null);
    if (!nickname.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }
    setIsLoading(true);
    try {
      const { user } = await signUpWithEmail(email.trim(), password);
      if (user) {
        await supabase.from('profiles').update({
          nickname: nickname.trim(),
          // TODO: Add birth_date column to profiles table and save birthdate
        }).eq('id', user.id);
      }
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message ?? '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const stepTitle = {
    1: '이메일 입력',
    2: '비밀번호 설정',
    3: '정보 입력',
  }[step];

  const stepSubtitle = {
    1: '씨앗을 심을 준비를 해요',
    2: '안전하게 보호할게요',
    3: '거의 다 왔어요!',
  }[step];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow justify-center px-8 py-6"
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with back button */}
          <View className="mb-6 flex-row items-center">
            {step > 1 ? (
              <Pressable onPress={handleBack} className="mr-3 rounded-lg p-2 active:bg-card">
                <Text className="text-lg text-muted-foreground">{'<'} 이전</Text>
              </Pressable>
            ) : (
              <View className="p-2" />
            )}
            <View className="flex-1 items-center">
              <ProgressDots currentStep={step} />
            </View>
            <View className="p-2 opacity-0">
              <Text className="text-lg">이전</Text>
            </View>
          </View>

          {/* SeedCharacter + Title */}
          <View className="mb-8 items-center gap-3">
            <SeedCharacter stage={seedStage} size={100} />
            <Text variant="h3" className="text-foreground">
              {stepTitle}
            </Text>
            <Text variant="muted">{stepSubtitle}</Text>
            <Text variant="small" className="text-muted-foreground">
              {step}/3 단계
            </Text>
          </View>

          {/* Error */}
          {error && (
            <View className="mb-4 w-full rounded-xl bg-destructive/10 p-3">
              <Text className="text-sm text-destructive">{error}</Text>
            </View>
          )}

          {/* Step Content */}
          {step === 1 && (
            <View className="w-full gap-3">
              <TextInput
                className="h-14 rounded-xl border border-border bg-card px-4 text-base text-foreground"
                placeholder="이메일 주소"
                placeholderTextColor="hsl(30 16% 47%)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoFocus
              />
              <Button onPress={handleNext} size="lg" className="mt-2 w-full bg-primary">
                <Text className="font-semibold text-primary-foreground">다음</Text>
              </Button>
            </View>
          )}

          {step === 2 && (
            <View className="w-full gap-3">
              <TextInput
                className="h-14 rounded-xl border border-border bg-card px-4 text-base text-foreground"
                placeholder="비밀번호 (6자 이상)"
                placeholderTextColor="hsl(30 16% 47%)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="new-password"
                autoFocus
              />
              <TextInput
                className="h-14 rounded-xl border border-border bg-card px-4 text-base text-foreground"
                placeholder="비밀번호 확인"
                placeholderTextColor="hsl(30 16% 47%)"
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                secureTextEntry
                autoComplete="new-password"
              />
              <Button onPress={handleNext} size="lg" className="mt-2 w-full bg-primary">
                <Text className="font-semibold text-primary-foreground">다음</Text>
              </Button>
            </View>
          )}

          {step === 3 && (
            <View className="w-full gap-3">
              <TextInput
                className="h-14 rounded-xl border border-border bg-card px-4 text-base text-foreground"
                placeholder="이름 (닉네임)"
                placeholderTextColor="hsl(30 16% 47%)"
                value={nickname}
                onChangeText={setNickname}
                autoComplete="name"
                autoFocus
              />
              <Text variant="small" className="mt-2 text-muted-foreground">
                생년월일 (선택)
              </Text>
              <View className="flex-row gap-2">
                <TextInput
                  className="h-14 flex-1 rounded-xl border border-border bg-card px-4 text-center text-base text-foreground"
                  placeholder="YYYY"
                  placeholderTextColor="hsl(30 16% 47%)"
                  value={birthYear}
                  onChangeText={(text) => setBirthYear(text.replace(/[^0-9]/g, '').slice(0, 4))}
                  keyboardType="number-pad"
                  maxLength={4}
                />
                <TextInput
                  className="h-14 w-20 rounded-xl border border-border bg-card px-4 text-center text-base text-foreground"
                  placeholder="MM"
                  placeholderTextColor="hsl(30 16% 47%)"
                  value={birthMonth}
                  onChangeText={(text) => setBirthMonth(text.replace(/[^0-9]/g, '').slice(0, 2))}
                  keyboardType="number-pad"
                  maxLength={2}
                />
                <TextInput
                  className="h-14 w-20 rounded-xl border border-border bg-card px-4 text-center text-base text-foreground"
                  placeholder="DD"
                  placeholderTextColor="hsl(30 16% 47%)"
                  value={birthDay}
                  onChangeText={(text) => setBirthDay(text.replace(/[^0-9]/g, '').slice(0, 2))}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
              <Button
                onPress={handleSignup}
                disabled={isLoading}
                size="lg"
                className="mt-2 w-full bg-bloom"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="hsl(0 0% 98%)" />
                ) : (
                  <Text className="font-semibold text-primary-foreground">가입하기</Text>
                )}
              </Button>
            </View>
          )}

          {/* Footer link */}
          <View className="mt-6 items-center">
            <Link href="/(auth)/login" asChild>
              <Button variant="ghost">
                <Text className="text-muted-foreground">이미 계정이 있으신가요? 로그인</Text>
              </Button>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
