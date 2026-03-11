import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/ui/text';
import * as React from 'react';
import { ActivityIndicator, TextInput, View } from 'react-native';
import { signInWithEmail, signUpWithEmail } from '../api/mutations';

function LoginForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSignUp, setIsSignUp] = React.useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (e: any) {
      setError(e.message ?? '오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="w-full gap-4 px-8">
      <View className="items-center gap-2">
        <Text className="text-2xl font-bold text-foreground">운전면허 독학</Text>
        <Text className="text-sm text-muted-foreground">
          {isSignUp ? '회원가입' : '로그인'}하여 시작하세요
        </Text>
      </View>

      {error && (
        <View className="rounded-lg bg-destructive/10 p-3">
          <Text className="text-sm text-destructive">{error}</Text>
        </View>
      )}

      <View className="gap-3">
        <TextInput
          className="h-12 rounded-lg border border-input bg-background px-4 text-base text-foreground"
          placeholder="이메일"
          placeholderTextColor="hsl(0 0% 45.1%)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <TextInput
          className="h-12 rounded-lg border border-input bg-background px-4 text-base text-foreground"
          placeholder="비밀번호"
          placeholderTextColor="hsl(0 0% 45.1%)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
        />
      </View>

      <Button onPress={handleSubmit} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="hsl(0 0% 98%)" />
        ) : (
          <Text>{isSignUp ? '회원가입' : '로그인'}</Text>
        )}
      </Button>

      <Button variant="ghost" onPress={() => setIsSignUp(!isSignUp)}>
        <Text>{isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}</Text>
      </Button>
    </View>
  );
}

export { LoginForm };
