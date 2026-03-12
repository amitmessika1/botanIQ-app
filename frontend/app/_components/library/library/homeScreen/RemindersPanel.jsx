import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function RemindersPanel({ reminders }) {
  const list =
    Array.isArray(reminders) && reminders.length
      ? reminders
      : ["אין תזכורות כרגע"];

  return (
    <View style={styles.reminders}>
      <Text style={styles.remindersTitle}>⏰ תזכורות</Text>
      {list.map((r, idx) => (
        <Text key={idx} style={styles.reminderItem}>
          {r}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  reminders: {
    marginTop: 20,
    backgroundColor: "#FFFDE7",
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: "#F9A825",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    alignItems: "flex-end",
  },
  remindersTitle: {
    fontWeight: "bold",
    color: "#6D4C41",
    marginBottom: 7,
    fontSize: 19,
    textAlign: "right",
  },
  reminderItem: {
    color: "#5D4037",
    marginBottom: 6,
    fontSize: 15,
    textAlign: "right",
    lineHeight: 20,
  },
});
