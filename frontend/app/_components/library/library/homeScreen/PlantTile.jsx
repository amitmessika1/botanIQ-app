import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Image } from "expo-image";


export default function PlantTile({ plant, onPress }) {
  const title = plant?.displayName || plant?.name || plant?.latin || "Unknown";

  /*const img =
    plant?.image?.url
      ? { uri: plant.image.url }
      : plant?.image
      ? plant.image
      : null;*/
      
      const url = plant?.image?.url;

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
  source={{ uri: plant.image?.url }}
  style={styles.image}
  contentFit="cover"
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

/*const styles = StyleSheet.create({
plantCard: {
  flex: 1,
  backgroundColor: "#fff",
  borderRadius: 16,
  margin: 6,
  padding: 12,
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#e2e8f0",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 3,
  elevation: 2,
  minHeight: 160,
  justifyContent: "center",
},

  plantImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
  },
plantName: {
  marginTop: 8,
  fontSize: 14,
  fontWeight: "700",
  color: "#0f172a",
  textAlign: "center",
},

});*/

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


