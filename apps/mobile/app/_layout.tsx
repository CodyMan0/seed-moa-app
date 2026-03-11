import '@/global.css';
import { setupNotificationHandler } from '@/features/notifications';
import { NAV_THEME } from '@/shared/components/ui/lib/theme';

import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import * as Notifications from 'expo-notifications';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useSession } from '@/shared/hooks/useSession';

// Set up notification handler before any component renders
setupNotificationHandler();

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const { isLoading, session } = useSession();

  // Handle notification taps to navigate to practice screen
  React.useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        if (data?.verseId && data?.type === 'practice_reminder') {
          router.push(`/practice/${data.verseId}`);
        }
      }
    );
    return () => subscription.remove();
  }, []);

  // Request notification permissions after auth
  React.useEffect(() => {
    if (session?.user) {
      Notifications.getPermissionsAsync().then(({ status }) => {
        if (status !== 'granted') {
          Notifications.requestPermissionsAsync();
        }
      });
    }
  }, [session?.user]);

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
