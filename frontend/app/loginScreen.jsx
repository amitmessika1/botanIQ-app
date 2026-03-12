import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';

import { useRouter } from 'expo-router';
import { login } from "./services/api"; 
import { saveToken } from "./services/token";


export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async () => {
    if (!username  || !password) {
      Alert.alert("שגיאה", "אנא מלא את כל השדות");
      return;
    }

    try {
      const data = await login({ username, password });
      
      if (!data?.token) {
        Alert.alert("שגיאה", data?.message || "ההתחברות נכשלה");
        return;
      }
      await saveToken(data.token);
      router.replace("/(tabs)/homeScreen");
    } catch (err) {
      Alert.alert("שגיאה", "שגיאת רשת / שרת לא זמין");
    }
  };

  return (
	<View style={styles.container}>
    <Image
  source={require("../assets/logo.png")}
  style={styles.logo}
  resizeMode="contain"
/>
		<TextInput
		 style={styles.input}
        placeholder="Username"
        value={username}
        autoCapitalize="none"
        //keyboardType="email-address"
        onChangeText={setUsername}
      />
	  <TextInput
	    style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
	  <TouchableOpacity 
	    style={styles.button} 
	    onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
	  <Text style={styles.footerText}>Don't have an account?</Text>
	  <TouchableOpacity 
	    style={styles.button} 
	    onPress={() => router.push('/SignupScreen')}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
	</View>
	
  )
 }
 
 const styles = StyleSheet.create({
  logo: {
  width: 340,
  height: 130,
  marginBottom: 18,
},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#2E7D32',
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#66BB6A',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  footerText: {
    marginVertical: 14, 
    color: '#555',       
},
});
 
 
 
 
 