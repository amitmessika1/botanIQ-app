import { Text, Image, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { plants } from "../data/plants";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";


export default function PlantProfile() {
  const { id } = useLocalSearchParams();
  const plant = plants.find((p) => p.id === id);

  if (!plant) return <Text>Plant not found</Text>;
  const router = useRouter();
  return (
	<SafeAreaView style={styles.safe}>
    <ScrollView style={styles.container}>
	<TouchableOpacity
      onPress={() => router.back()}
      style={styles.backButton}
    >
      <Ionicons name="arrow-back" size={28} color="#2E7D32" />
    </TouchableOpacity>
	
      <Image source={plant.image} style={styles.image} />

      <Text style={styles.title}>{plant.name}</Text>

      <Text style={styles.sectionTitle}>💧 השקיה</Text>
      <Text style={styles.text}>{plant.watering}</Text>

      <Text style={styles.sectionTitle}>☀️ שמש</Text>
      <Text style={styles.text}>{plant.sun}</Text>

      <Text style={styles.sectionTitle}>📖 מידע כללי</Text>
      <Text style={styles.text}>{plant.description}</Text>
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
  imageContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
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
  safe: {
    flex: 1,
    backgroundColor: "#F1F8F4",
  },
});

