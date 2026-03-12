import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppHeader from "../_components/AppHeader";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#1B5E20",
        tabBarInactiveTintColor: "#9E9E9E",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          height: 50 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 5,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "600",
        },
        headerTitle: () => <AppHeader />,
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerStyle: {
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 0,
        borderBottomColor: "#e2e8f0",
        elevation: 8,              // אנדרואיד (כמו הטאב)
        shadowColor: "#000",       // iOS
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      headerTitleContainerStyle: {
        paddingHorizontal: 0,     // כמו ריווח כללי
        paddingBottom: 20, 
      },
      }}
    >
      <Tabs.Screen
        name="homeScreen"
        options={{
          title: "My garden",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={26} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="people" size={size} color={color} 
      />
    ),
  }}
/>

    </Tabs>
  );
}