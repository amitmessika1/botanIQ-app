import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1B5E20",
        tabBarInactiveTintColor: "#9E9E9E",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
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