import React from "react";
import { TextInput, StyleSheet } from "react-native";

export default function SearchBar({ value, onChange }) {
  return (
    <TextInput
      placeholder="חפש צמח..."
      value={value}
      onChangeText={onChange}
      style={styles.searchBox}
      autoCorrect={false}
      autoCapitalize="none"
    />
  );
}
 
 const styles = StyleSheet.create({
 searchBox: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    borderColor: "#66BB6A",
    borderWidth: 1.5,
    marginBottom: 18,
    fontSize: 16,
    textAlign: "right",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});