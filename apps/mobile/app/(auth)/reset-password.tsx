import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/ui/text';
import { SeedCharacter } from '@/shared/components/ui/seed-character';
import { supabase } from '@/shared/supabase/supabase';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import * as React from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResetPasswordScreen() {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('알림', '이메일을 입력해주세요.');
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) throw error;
      setSent(true);
    } catch (e: any) {
      Alert.alert('오류', e.message ?? '비밀번호 재설정 메일 발송에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 py-2">
        <Pressable onPress={() => router.back()} className="flex-row items-center gap-1">
          <ChevronLeft size={20} color="hsl(25 40% 64%)" />
          <Text className="text-seed">돌아가기</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 items-center justify-center px-8">
          {sent ? (
            <View className="items-center gap-4 w-full">
              <SeedCharacter stage={3} size={80} />
              <Text className="text-xl font-bold text-foreground">메일을 보냈어요!</Text>
              <Text variant="muted" className="text-center">
                {email}으로{'\n'}비밀번호 재설정 링크를 보냈습니다.
              </Text>
              <Text variant="muted" className="text-center text-xs">
                메일이 오지 않으면 스팸함을 확인해주세요.
              </Text>
              <Button
                className="mt-4 w-full bg-primary"
                size="lg"
                onPress={() => router.back()}
              >
                <Text className="font-semibold text-primary-foreground">로그인으로 돌아가기</Text>
              </Button>
            </View>
          ) : (
            <View className="w-full gap-4">
              <View className="items-center gap-3 mb-4">
                <SeedCharacter stage={1} size={80} />
                <Text className="text-xl font-bold text-foreground">비밀번호 찾기</Text>
                <Text variant="muted" className="text-center">
                  가입할 때 사용한 이메일을 입력하면{'\n'}재설정 링크를 보내드려요.
                </Text>
              </View>

              <TextInput
                className="h-14 rounded-2xl bg-muted px-4 text-base text-foreground"
                placeholder="이메일 주소"
                placeholderTextColor="hsl(30 16% 47%)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoFocus
              />

              <Button
                className="w-full bg-primary"
                size="lg"
                onPress={handleReset}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="font-semibold text-primary-foreground">재설정 메일 보내기</Text>
                )}
              </Button>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
