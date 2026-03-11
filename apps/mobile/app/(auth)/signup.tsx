import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/ui/text';
import { SeedCharacter } from '@/shared/components/ui/seed-character';
import { signUpWithEmail } from '@/features/auth';
import { supabase } from '@/shared/supabase/supabase';
import { Link, router } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import * as React from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { GrowthStage } from '@/shared/components/ui/seed-character';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_HEIGHT = 360;

function BottomSheetPicker({
  title,
  options,
  suffix,
  selected,
  onSelect,
  onClose,
}: {
  title: string;
  options: number[];
  suffix: string;
  selected: number | null;
  onSelect: (value: number) => void;
  onClose: () => void;
}) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(SHEET_HEIGHT)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SHEET_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  return (
    <Modal visible transparent animationType="none">
      <Animated.View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', opacity: fadeAnim }}>
        <Pressable style={{ flex: 1 }} onPress={handleClose} />
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: SHEET_HEIGHT,
          transform: [{ translateY: slideAnim }],
          backgroundColor: 'hsl(0 0% 100%)',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 32,
        }}
      >
        <View style={{ width: 40, height: 4, backgroundColor: 'hsl(30 35% 82%)', borderRadius: 2, alignSelf: 'center', marginBottom: 12 }} />
        <Text className="mb-4 text-center font-semibold text-foreground">{title}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {options.map((opt) => (
            <Pressable
              key={opt}
              onPress={() => {
                onSelect(opt);
                handleClose();
              }}
              className="items-center border-b border-border py-3"
            >
              <Text
                className={`text-lg ${selected === opt ? 'font-bold text-primary' : 'text-foreground'}`}
              >
                {opt}{suffix}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

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
  const [birthYear, setBirthYear] = React.useState<number | null>(null);
  const [birthMonth, setBirthMonth] = React.useState<number | null>(null);
  const [birthDay, setBirthDay] = React.useState<number | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState(false);
  const [showPicker, setShowPicker] = React.useState<'year' | 'month' | 'day' | null>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

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

  const pickerOptions = showPicker === 'year' ? years : showPicker === 'month' ? months : days;
  const pickerSuffix = showPicker === 'year' ? '년' : showPicker === 'month' ? '월' : '일';
  const pickerTitle = showPicker === 'year' ? '출생연도' : showPicker === 'month' ? '월' : '일';
  const pickerSelected = showPicker === 'year' ? birthYear : showPicker === 'month' ? birthMonth : birthDay;

  const handlePickerSelect = (value: number) => {
    if (showPicker === 'year') setBirthYear(value);
    else if (showPicker === 'month') setBirthMonth(value);
    else if (showPicker === 'day') setBirthDay(value);
  };

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
                className="h-14 rounded-2xl bg-muted px-4 text-base text-foreground"
                placeholder="이메일 주소"
                placeholderTextColor="hsl(30 16% 47%)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoFocus
              />
              <Button onPress={handleNext} size="lg" className="mt-2 w-full bg-sprout">
                <Text className="font-semibold text-primary-foreground">다음</Text>
              </Button>
            </View>
          )}

          {step === 2 && (
            <View className="w-full gap-3">
              <View className="relative">
                <TextInput
                  className="h-14 rounded-2xl bg-muted px-4 pr-12 text-base text-foreground"
                  placeholder="비밀번호 (6자 이상)"
                  placeholderTextColor="hsl(30 16% 47%)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  autoFocus
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-0 bottom-0 justify-center"
                >
                  {showPassword ? (
                    <EyeOff size={20} color="hsl(30 16% 47%)" />
                  ) : (
                    <Eye size={20} color="hsl(30 16% 47%)" />
                  )}
                </Pressable>
              </View>
              <View className="relative">
                <TextInput
                  className="h-14 rounded-2xl bg-muted px-4 pr-12 text-base text-foreground"
                  placeholder="비밀번호 확인"
                  placeholderTextColor="hsl(30 16% 47%)"
                  value={passwordConfirm}
                  onChangeText={setPasswordConfirm}
                  secureTextEntry={!showPasswordConfirm}
                  autoComplete="new-password"
                />
                <Pressable
                  onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-4 top-0 bottom-0 justify-center"
                >
                  {showPasswordConfirm ? (
                    <EyeOff size={20} color="hsl(30 16% 47%)" />
                  ) : (
                    <Eye size={20} color="hsl(30 16% 47%)" />
                  )}
                </Pressable>
              </View>
              <Button onPress={handleNext} size="lg" className="mt-2 w-full bg-sprout">
                <Text className="font-semibold text-primary-foreground">다음</Text>
              </Button>
            </View>
          )}

          {step === 3 && (
            <View className="w-full gap-3">
              <TextInput
                className="h-14 rounded-2xl bg-muted px-4 text-base text-foreground"
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
                <Pressable
                  onPress={() => setShowPicker('year')}
                  className="h-14 flex-1 items-center justify-center rounded-2xl bg-muted"
                >
                  <Text className={`text-base ${birthYear ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {birthYear ? `${birthYear}년` : '년'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setShowPicker('month')}
                  className="h-14 flex-1 items-center justify-center rounded-2xl bg-muted"
                >
                  <Text className={`text-base ${birthMonth ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {birthMonth ? `${birthMonth}월` : '월'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setShowPicker('day')}
                  className="h-14 flex-1 items-center justify-center rounded-2xl bg-muted"
                >
                  <Text className={`text-base ${birthDay ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {birthDay ? `${birthDay}일` : '일'}
                  </Text>
                </Pressable>
              </View>
              <Button
                onPress={handleSignup}
                disabled={isLoading}
                size="lg"
                className="mt-2 w-full bg-sprout"
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

      {/* Birth date picker modal */}
      {showPicker !== null && (
        <BottomSheetPicker
          title={pickerTitle}
          options={pickerOptions}
          suffix={pickerSuffix}
          selected={pickerSelected}
          onSelect={handlePickerSelect}
          onClose={() => setShowPicker(null)}
        />
      )}
    </SafeAreaView>
  );
}
