import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';


export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('שגיאה', 'אנא מלא את כל השדות');
      return;
    }
    router.replace('/(tabs)/homeScreen');
  }
  
  return (
	<View style={styles.container}>
		<Text style={styles.title}>התחברות</Text>
		<TextInput
		 style={styles.input}
        placeholder="email"
        keyboardType="email-address"
        onChangeText={setEmail}
      />
	  <TextInput
	    style={styles.input}
        placeholder="password"
        secureTextEntry
        onChangeText={setPassword}
      />
	  <TouchableOpacity 
	    style={styles.button} 
	    onPress={handleLogin}>
        <Text style={styles.buttonText}>Log in</Text>
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
    marginBottom: 40,
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
    marginVertical: 20, 
    color: '#555',       
},
});
 
 
 
 
 