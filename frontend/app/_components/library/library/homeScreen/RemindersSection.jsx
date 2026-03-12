import React, { useEffect, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import RemindersPanel from "./RemindersPanel";
import { useReminders } from "../../../../hooks/useReminders";

function formatReminder(r) {
  if (!r || typeof r !== "object") return String(r ?? "");

  const name = r.title || r.name || "הצמח";

  // אם כבר הגיע הזמן (daysLeft <= 0 או status === "due")
  if (r.status === "due" || (typeof r.daysLeft === "number" && r.daysLeft <= 0)) {
    return `השקה את ${name} היום`;
  }

  const days =
    typeof r.daysLeft === "number"
      ? r.daysLeft
      : null;

  if (days === null) {
    return `השקה את ${name}`;
  }

  return `השקה את ${name} בעוד ${days} ימים`;
}


export default function RemindersSection({ refreshKey }) {
  const { reminders, loading, error, reloadReminders } = useReminders({ auto: true });

	useEffect(() => {
	reloadReminders();
	}, [refreshKey, reloadReminders]);

  const list = useMemo(() => reminders.map(formatReminder), [reminders]);

  return (
    <View style={styles.wrap}>
      {loading ? <Text style={styles.info}>טוען תזכורות…</Text> : null}
      {error ? <Text style={styles.error}>לא הצלחתי לטעון תזכורות</Text> : null}
      <RemindersPanel reminders={list} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 0 },
  info: { textAlign: "right", color: "#6D4C41", marginBottom: 0 },
  error: { textAlign: "right", color: "#B71C1C", marginBottom: 0 },
});
