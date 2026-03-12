import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function ActionButton({
  title,
  onPress,
  variant = "primary",
  style,
  compact = false,
}) {
  return (
    <TouchableOpacity
      style={[styles.base, compact && styles.compactBase, styles[variant], style]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={[styles.baseText, compact && styles.compactText, styles[`${variant}Text`]]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  base: {
    padding: 16,
    borderRadius: 25,
    alignSelf: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    minWidth: 200,
  },
  baseText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },

  primary: { backgroundColor: "#43A047" },
  primaryText: { color: "#fff" },

  danger: { backgroundColor: "#D32F2F" },
  dangerText: { color: "#fff" },

  secondary: {
    backgroundColor: "#E8F5E9",
    borderWidth: 1,
    borderColor: "#66BB6A",
  },
  secondaryText: { color: "#1B5E20" },
  compactBase: {
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 12,
  minWidth: 0,
  alignSelf: "auto",
  elevation: 0,
  shadowOpacity: 0,
},
compactText: {
  fontSize: 13,
  fontWeight: "700",
},

});
