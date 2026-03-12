import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { deleteToken } from "../services/token";
import MyGardenGrid from "../_components/library/library/homeScreen/MyGardenGrid";
import AddPlantModal from "../_components/library/library/homeScreen/AddPlantModal";
import PlantDetailsModal from "../_components/library/library/homeScreen/PlantDetailsModal";
import RemindersSection from "../_components/library/library/homeScreen/RemindersSection";
import ActionButton from "../_components/library/library/homeScreen/ActionButton";
import { getMyGarden, updateLastWatered } from "../services/api";


export default function HomeScreen() {
  const router = useRouter();

  const [selectedPlant, setSelectedPlant] = useState(null);
  const [addPlant, setAddPlant] = useState(false);

  const [gardenPlants, setGardenPlants] = useState([]);
  const [remindersRefreshKey, setRemindersRefreshKey] = useState(0);
  const bumpReminders = useCallback(() => {
  setRemindersRefreshKey((k) => k + 1);
  }, []);

const reloadGarden = async () => {
  try {
    const data = await getMyGarden();
    const next = Array.isArray(data) ? data : [];
    setGardenPlants(next);
    return next;
  } catch (e) {
    console.warn("getMyGarden failed:", e?.message || e);
    setGardenPlants([]);
    return [];
  }
};



		useEffect(() => {
		reloadGarden();
		}, []);

  const handleLogout = async () => {
    await deleteToken();
    router.replace("/loginScreen");
  };

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>הגינה שלי</Text>

  <MyGardenGrid plants={gardenPlants} onSelect={setSelectedPlant} />

  <View style={styles.footer}>
    <ActionButton
      title="+ הוסף צמח חדש"
      variant="primary"
      onPress={() => setAddPlant(true)}
      style={{ marginTop: 9, marginBottom: 0 }}
    />

    <RemindersSection refreshKey={remindersRefreshKey} />
    </View>
  

<AddPlantModal
  visible={addPlant}
  onClose={() => setAddPlant(false)}
  onAdded={async () => {
    await reloadGarden();
    bumpReminders();
  }}
/>

<PlantDetailsModal
  plant={selectedPlant}
  visible={!!selectedPlant}
  onClose={() => setSelectedPlant(null)}
  onMoreInfo={(id) => {
    setSelectedPlant(null);
    router.push(`/plant/${selectedPlant._id}`);
  }}
  onRemoved={async (id) => {
    setGardenPlants((prev) =>
      prev.filter((p) => String(p._id || p.id) !== String(id))
    );
    await reloadGarden();
    bumpReminders();
  }}
  onWateredAt={async (plantId, date) => {
    try {
      await updateLastWatered(plantId, date);
      bumpReminders();
    } catch (error) {}

    const next = await reloadGarden();
    const updated = next.find(
      (p) => String(p._id || p.id) === String(plantId)
    );
    setSelectedPlant(updated || null);
  }}
/>

      </View>
    </SafeAreaView>
  );
}

/*const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F1F8F4",
  },
container: {
  flex: 1,
  backgroundColor: "#F1F8F4",
},

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1B5E20",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});*/

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 10,
  },
  footerCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  footer: {
  paddingTop: 10,
  paddingBottom: 14,
},
});








