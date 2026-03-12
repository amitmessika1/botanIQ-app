import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";

export default function PlantsListFooter({ loadingMore, hasMore, onLoadMore }) {
  if (loadingMore) {
    return (
      <View style={styles.footer}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>טוען עוד...</Text>
      </View>
    );
  }

  if (hasMore) {
    return (
      <TouchableOpacity style={styles.loadMoreBtn} onPress={onLoadMore} activeOpacity={0.85}>
        <Text style={styles.loadMoreText}>טען עוד</Text>
      </TouchableOpacity>
    );
  }

  return <View style={{ height: 12 }} />;
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadingText: {
    color: "#64748b",
  },
  loadMoreBtn: {
    marginTop: 8,
    marginBottom: 16,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#e8f5e9",
    borderWidth: 1,
    borderColor: "#c8e6c9",
  },
  loadMoreText: {
    color: "#2E7D32",
    fontWeight: "700",
  },
});
