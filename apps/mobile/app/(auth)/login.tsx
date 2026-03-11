import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/ui/text';
import { SeedCharacter } from '@/shared/components/ui/seed-character';
import { signInWithEmail } from '@/features/auth';
import { Link, router } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import * as React from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [showPassword, setShowPassword] = React.useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmail(email, password);
      router.replace('/(tabs)');
    } catch (e: any) {
      const msg = e.message ?? '';
      if (msg.includes('Invalid login credentials')) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else if (msg.includes('Email not confirmed')) {
        setError('이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요.');
      } else if (msg.includes('Too many requests') || msg.includes('rate limit')) {
        setError('로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.');
      } else if (msg.includes('network') || msg.includes('fetch')) {
        setError('네트워크 연결을 확인해주세요.');
      } else {
        setError('로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 items-center justify-center px-8">
          <View className="mb-10 items-center gap-3">
            <SeedCharacter stage={1} size={100} />
            <Text variant="h1" className="text-foreground">
              씨앗모아
            </Text>
            <Text variant="muted">마음 밭에 말씀을 심어보세요</Text>
          </View>

          {error && (
            <View className="mb-4 w-full rounded-lg bg-destructive/10 p-3">
              <Text className="text-sm text-destructive">{error}</Text>
            </View>
          )}

          <View className="w-full gap-3">
            <TextInput
              className="h-14 rounded-2xl bg-muted px-4 text-base text-foreground"
              placeholder="이메일"
              placeholderTextColor="hsl(30 16% 47%)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <View className="relative">
              <TextInput
                className="h-14 rounded-2xl bg-muted px-4 pr-12 text-base text-foreground"
                placeholder="비밀번호"
                placeholderTextColor="hsl(30 16% 47%)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
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
          </View>

          <View className="mt-4 w-full">
            <Button onPress={handleLogin} disabled={isLoading} size="lg" className="w-full bg-primary">
              {isLoading ? (
                <ActivityIndicator size="small" color="hsl(0 0% 98%)" />
              ) : (
                <Text className="text-primary-foreground font-semibold">로그인</Text>
              )}
            </Button>

            <Button variant="ghost" className="mt-2 w-full" onPress={() => router.push('/(auth)/reset-password')}>
              <Text className="text-muted-foreground text-sm">비밀번호를 잊으셨나요?</Text>
            </Button>

            <Link href="/(auth)/signup" asChild>
              <Button variant="ghost" className="w-full">
                <Text className="text-muted-foreground">계정이 없으신가요? 회원가입</Text>
              </Button>
            </Link>

            <Button
              variant="ghost"
              className="w-full"
              onPress={() => router.replace('/(tabs)')}
            >
              <Text className="text-muted-foreground underline">비회원으로 둘러보기</Text>
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
