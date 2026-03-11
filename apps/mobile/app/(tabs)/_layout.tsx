import { Tabs } from 'expo-router';
import { BookmarkCheck, BookOpen, Ellipsis, Home, Sprout } from 'lucide-react-native';
import { Platform } from 'react-native';

const ACTIVE_FILL = 'rgba(212, 165, 116, 0.25)'; // seed color at 25% opacity

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'hsl(25 40% 64%)',
        tabBarInactiveTintColor: 'hsl(30 16% 47%)',
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Pretendard-Medium',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarStyle: {
          backgroundColor: 'hsl(0 0% 100%)',
          borderTopColor: 'hsl(30 35% 82%)',
          borderTopWidth: 0.5,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 6,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color, focused }) => <Home color={color} fill={focused ? ACTIVE_FILL : 'none'} size={24} />,
        }}
      />
      <Tabs.Screen
        name="bible"
        options={{
          title: '성경',
          tabBarIcon: ({ color, focused }) => <BookOpen color={color} fill={focused ? ACTIVE_FILL : 'none'} size={24} />,
        }}
      />
      <Tabs.Screen
        name="growth"
        options={{
          title: '성장',
          tabBarIcon: ({ color, focused }) => <Sprout color={color} fill={focused ? ACTIVE_FILL : 'none'} size={24} />,
        }}
      />
      <Tabs.Screen
        name="my-verses"
        options={{
          title: '내 암송',
          tabBarIcon: ({ color, focused }) => <BookmarkCheck color={color} fill={focused ? ACTIVE_FILL : 'none'} size={24} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '더보기',
          tabBarIcon: ({ color, focused }) => <Ellipsis color={color} fill={focused ? ACTIVE_FILL : 'none'} size={24} />,
        }}
      />
    </Tabs>
  );
}
