import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2E7D32",
        tabBarInactiveTintColor: "#9E9E9E",
        tabBarStyle: {
          backgroundColor: "#F1F8E9",
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="homeScreen"
        options={{
          title: "הגינה שלי",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="library"
        options={{
          title: "ספרייה",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
