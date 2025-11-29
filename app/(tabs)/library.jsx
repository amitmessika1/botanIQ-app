import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { plants } from "../data/plants";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { TextInput } from "react-native";

export default function Library() {
  const router = useRouter();
  const [filteredPlants, setFilteredPlants] = useState(plants); 
  
  
  const handleSearch = (text) => {
  const filtered = plants.filter((plant) =>
    plant.name.toLowerCase().includes(text.toLowerCase())
  );

  setFilteredPlants(filtered);
};


  return (
     <SafeAreaView style={styles.container}>
      <Text style={styles.title}>ספריית צמחים📚</Text>
	  <TextInput
        placeholder="חפש צמח..."
        onChangeText={handleSearch}
        style={styles.searchBox}
     />

      <FlatList
        data={filteredPlants}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/plant/${item.id}`)}
          >
            <Image source={item.image} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
		ListEmptyComponent={<Text style={styles.noResults}>לא נמצאו תוצאות</Text>}
      />
     </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F8F4",
    paddingTop: 40,
    paddingHorizontal: 15
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1B5E20",
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    margin: 8,
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    minHeight: 160,
    justifyContent: "center",
  },
  image: { 
    width: 100, 
    height: 100, 
    resizeMode: "contain",
    marginBottom: 8,
  },
  name: { 
    marginTop: 8, 
    fontSize: 16, 
    fontWeight: "600",
    color: "#2E7D32",
  },
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
  noResults: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "500",
    color: "#6D4C41",
    marginTop: 30,
    backgroundColor: "#FFF3E0",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
});
