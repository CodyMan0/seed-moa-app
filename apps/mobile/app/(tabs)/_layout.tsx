import { Tabs } from 'expo-router';
import { BookmarkCheck, BookOpen, Home, Settings } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: 'hsl(25 40% 64%)',
        tabBarInactiveTintColor: 'hsl(30 16% 47%)',
        tabBarStyle: {
          backgroundColor: 'hsl(0 0% 100%)',
          borderTopColor: 'hsl(30 35% 82%)',
        },
        headerStyle: {
          backgroundColor: 'hsl(37 88% 96%)',
        },
        headerTintColor: 'hsl(30 36% 17%)',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="bible"
        options={{
          title: '성경',
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="my-verses"
        options={{
          title: '내 암송',
          tabBarIcon: ({ color, size }) => <BookmarkCheck color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '설정',
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
