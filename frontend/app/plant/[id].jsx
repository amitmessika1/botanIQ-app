import React, { useEffect, useState } from "react";
import { Text, StyleSheet, ScrollView, View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPlantById } from "../services/api";

export default function PlantProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [plant, setPlant] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await getPlantById(id);
      setPlant(data && !data.message ? data : null);
    })();
  }, [id]);

  if (!plant) return <Text style={{ padding: 20 }}>טוען...</Text>;

  const title =
    plant?.displayName ||
    plant?.name ||
    plant?.latin ||
    "Unknown";


  const img = plant?.image?.url ? { uri: plant.image.url } : null;

  const commonNames =
    Array.isArray(plant?.common) && plant.common.length
      ? plant.common.join(", ")
      : null;

  const insects =
    Array.isArray(plant?.insects) && plant.insects.length
      ? plant.insects.join(", ")
      : null;

  const diseases =
    plant?.diseases && plant.diseases !== "N/A"
      ? plant.diseases
      : null;

  const tempMinC = plant?.tempmin?.celsius;
  const tempMaxC = plant?.tempmax?.celsius;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 10 }}>
        <Ionicons name="arrow-back" size={28} color="#2E7D32" />
      </TouchableOpacity>

      <ScrollView>
        {plant?.image?.url ? (
  <Image
    source={{ uri: plant.image.url }}
    style={styles.image}
    contentFit="contain"
  />
) : (
  <View style={styles.imagePlaceholder} />
)}


        <Text style={styles.title}>{title}</Text>

        <Text style={styles.sectionTitle}>📖 מידע כללי</Text>
        <Text style={styles.text}>
          {plant?.family ? `משפחה: ${plant.family}\n` : ""}
          {commonNames ? `שמות נפוצים: ${commonNames}\n` : ""}
          {plant?.origin ? `מקור: ${plant.origin}\n` : ""}
          {plant?.climate ? `אקלים: ${plant.climate}\n` : ""}
        </Text>

        <Text style={styles.sectionTitle}>🪴 תנאי גידול</Text>
        <Text style={styles.text}>
          {plant?.ideallight ? `אור מומלץ: ${plant.ideallight}\n` : ""}
          {plant?.toleratedlight ? `אור נסבל: ${plant.toleratedlight}\n` : ""}
          {plant?.watering ? `השקיה: ${plant.watering}\n` : ""}
          {(typeof tempMinC === "number" || typeof tempMaxC === "number")
            ? `טמפרטורה: ${typeof tempMinC === "number" ? `${tempMinC}°C` : "?"}–${typeof tempMaxC === "number" ? `${tempMaxC}°C` : "?"}\n`
            : ""}
        </Text>

        <Text style={styles.sectionTitle}>🐛 מזיקים ומחלות</Text>
        <Text style={styles.text}>
          {insects ? `מזיקים נפוצים: ${insects}\n` : "מזיקים נפוצים: אין מידע\n"}
          {diseases ? `מחלות: ${diseases}\n` : "מחלות: אין מידע\n"}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}


  const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F8F4",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 25,
    textAlign: "center",
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B5E20",
    marginBottom: 10,
    textAlign: "right",
  },
  text: {
    fontSize: 16,
    color: "#424242",
    lineHeight: 24,
    textAlign: "right",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 15,
    zIndex: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

