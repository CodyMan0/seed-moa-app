import '@/global.css';
import { NAV_THEME } from '@/shared/components/ui/lib/theme';

import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useSession } from '@/shared/hooks/useSession';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const { isLoading } = useSession();

  if (isLoading) {
    return (
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <View className="flex-1 items-center justify-center bg-background">
          <ActivityIndicator size="large" />
        </View>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}
