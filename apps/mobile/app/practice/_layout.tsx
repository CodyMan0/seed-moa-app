import { Stack } from 'expo-router';

export default function PracticeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: '뒤로',
      }}
    />
  );
}
