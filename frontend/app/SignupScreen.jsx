import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { signup } from "./services/api";
import { saveToken } from "./services/token";

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("שגיאה", "אנא מלאי את כל השדות");
      return;
    }

    try {
      const data = await signup({ email, password });

      if (!data?.token) {
        Alert.alert("שגיאה", data?.message || "ההרשמה נכשלה");
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
	  <Text style={styles.title}>הרשמה</Text>
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
	   <TextInput
        style={styles.input}
        placeholder="confirm password"
        secureTextEntry
        onChangeText={setConfirmPassword}
      />
	  <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Create an account</Text>
      </TouchableOpacity>	
	</View>
  );
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
  text: {
    marginTop: 30,
    marginBottom: 10,
  },
  link: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
});