import { Tabs } from 'expo-router';
import { BookmarkCheck, BookOpen, Home } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: 'hsl(0, 0%, 9%)',
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
    </Tabs>
  );
}
