import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";


export default function PlantCard({ item, onPress }) {
  const title = item?.displayName || item?.name || item?.latin || "Unknown";
  //const img = item?.image?.url ? { uri: item.image.url } : null;
  const url = item?.image?.url;

const img =
  typeof url === "string" &&
  url.startsWith("http") &&
  !url.startsWith("data:image/svg") &&
  !url.toLowerCase().endsWith(".svg")
    ? { uri: url }
    : null;


  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {img ? (
  <Image
    source={img}
    style={styles.image}
    contentFit="cover"
    transition={150}
  />
) : (
  <View style={styles.imagePlaceholder} />
)}

      <Text style={styles.name} numberOfLines={2}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
  },
  imagePlaceholder: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    backgroundColor: "#e2e8f0",
  },
  name: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
    textAlign: "center",
    minHeight: 36,
  },
});
