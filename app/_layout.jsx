import { Stack } from 'expo-router';
import { Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Layout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#E8F5E9', 
        },
        headerTitle: '', 
        headerShadowVisible: false, 
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={require('../assets/back.png')} 
              style={{ width: 24, height: 24, marginLeft: 15 }}
            />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <Image
            source={require('../assets/logo.png')} 
            style={{ width: 40, height: 40, marginRight: 15 }}
          />
        ),
      }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }}/>
    </Stack>
  );
}

