import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Modal,} from "react-native";
import { useRouter } from "expo-router";
import { plants } from "../data/plants";
import { deleteToken } from "../services/token";

export default function HomeScreen() {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const router = useRouter();
  
  const handleLogout = async () => {
  await deleteToken();
  router.replace("/loginScreen");
};

  return (
	<SafeAreaView style={styles.safeArea}>
	  <View style={styles.container}>
		<Text style={styles.title}>הגינה שלי 👩‍🌾</Text>
		<FlatList
		  data={plants}
		  keyExtractor={(item) => item.id}
		  numColumns={2}
		  renderItem={({ item }) => (
			<TouchableOpacity
			  style={styles.plantCard}
			  onPress={() => setSelectedPlant(item)}
			>
			  <Image source={item.image} style={styles.plantImage} resizeMode="contain" />
			  <Text style={styles.plantName}>{item.name}</Text>
			</TouchableOpacity>
		  )}
		  ListEmptyComponent={
			<Text style={styles.emptyMessage}> הגינה שלך עדיין ריקה ⏳</Text>
		  }
		/>
		
		<TouchableOpacity style={styles.addButton}>
		  <Text style={styles.addButtonText}>+ הוסף צמח חדש</Text>
		</TouchableOpacity>
		
		<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>


		<Modal visible={!!selectedPlant} transparent animationType="slide">
		  <View style={styles.modalContainer}>
			<View style={styles.modalContent}>
			  <Image
				source={selectedPlant?.image}
				style={styles.modalImage}
				resizeMode="contain"
			  />
			  <Text style={styles.modalText}>{selectedPlant?.description}</Text>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => {
            setSelectedPlant(null);
            router.push(`/plant/${selectedPlant.id}`)}}
        >
          <Text style={styles.moreButtonText}>למידע נוסף...</Text>
        </TouchableOpacity>
			  <TouchableOpacity
				style={styles.closeButtonContainer}
				onPress={() => setSelectedPlant(null)}
			  >
				<Text style={styles.closeButton}>סגירה</Text>
			  </TouchableOpacity>
			</View>
		  </View>
		</Modal>
		
	  <View style={styles.reminders}>
		<Text style={styles.remindersTitle}>⏰ תזכורות</Text>
		<Text style={styles.reminderItem}>📌השקה את הלבנדר מחר בבוקר</Text>
		<Text style={styles.reminderItem}>📌בדוק את האדמה של הרוזמרין</Text>
	  </View>  
	  </View>   
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
	flex: 1,
	backgroundColor: "#F1F8F4",
  },
  container: {
	flex: 1,
	backgroundColor: "#F1F8F4",
	padding: 20,
  },
  title: {
	fontSize: 32,
	fontWeight: "bold",
	marginBottom: 20,
	textAlign: "center",
	color: "#1B5E20",
	textShadowColor: 'rgba(0, 0, 0, 0.1)',
	textShadowOffset: { width: 0, height: 1 },
	textShadowRadius: 2,
  },
  emptyMessage: {
	textAlign: "center",
	fontSize: 18,
	color: "#66BB6A",
	marginTop: 40,
	fontWeight: "500",
  },
  plantCard: {
	flex: 1,
	backgroundColor: "#fff",
	borderRadius: 16,
	margin: 8,
	padding: 15,
	alignItems: "center",
	elevation: 4,
	shadowColor: "#000",
	shadowOffset: { width: 0, height: 2 },
	shadowOpacity: 0.15,
	shadowRadius: 4,
	minHeight: 160,
	justifyContent: "center",
  },
  plantImage: {
	width: 100,
	height: 100,
	marginBottom: 8,
  },
  plantName: {
	marginTop: 8,
	fontSize: 16,
	fontWeight: "600",
	color: "#2E7D32",
  },
  addButton: {
	backgroundColor: "#43A047",
	padding: 16,
	borderRadius: 25,
	alignSelf: "center",
	marginTop: 15,
	marginBottom: 15,
	elevation: 4,
	shadowColor: "#000",
	shadowOffset: { width: 0, height: 2 },
	shadowOpacity: 0.2,
	shadowRadius: 4,
	minWidth: 200,
  },
  addButtonText: {
	color: "#fff",
	fontWeight: "bold",
	fontSize: 16,
	textAlign: "center",
  },
  modalContainer: {
	flex: 1,
	backgroundColor: 'rgba(0,0,0, 0.5)',
	justifyContent: 'center',
	alignItems: 'center',
  },
  modalContent: {
	backgroundColor: '#fff',
	borderRadius: 20,
	padding: 24,
	width: '85%',
	alignItems: 'center',
	elevation: 8,
	shadowColor: "#000",
	shadowOffset: { width: 0, height: 4 },
	shadowOpacity: 0.3,
	shadowRadius: 6,
  },
  modalImage: {
	width: 180,
	height: 180,
	borderRadius: 90,
	marginBottom: 20,
  },
  modalTitle: {
	fontSize: 24,
	fontWeight: 'bold',
	color: '#1B5E20',
	marginBottom: 12,
	textAlign: 'center',
  },
  modalText: {
	fontSize: 17,
	color: '#424242',
	marginBottom: 16,
	textAlign: 'center',
	lineHeight: 24,
  },
  closeButtonContainer: {
	backgroundColor: '#43A047',
	borderRadius: 25,
	paddingVertical: 12,
	paddingHorizontal: 30,
	elevation: 3,
	shadowColor: "#000",
	shadowOffset: { width: 0, height: 2 },
	shadowOpacity: 0.15,
	shadowRadius: 3,
  },
  closeButton: {
	color: '#fff',
	fontWeight: 'bold',
	fontSize: 16,
  },
  reminders: {
	marginTop: 20,
	backgroundColor: "#FFFDE7", 
	borderRadius: 16,
	padding: 20,
	borderWidth: 1,
	borderColor: "#F9A825", 
	shadowColor: "#000",
	shadowOpacity: 0.1,
	shadowOffset: { width: 0, height: 2 },
	shadowRadius: 4,
	elevation: 3, 
	alignItems: 'flex-end',
  },
  remindersTitle: {
	fontWeight: "bold",
	color: "#6D4C41", 
	marginBottom: 12,
	fontSize: 19,
	textAlign: 'right',
  },
  reminderItem: {
	color: "#5D4037",
	marginBottom: 8,
	fontSize: 15,
	textAlign: 'right',
	lineHeight: 20,
  },
  moreButton: {       
	marginBottom: 20,
	backgroundColor: '#E8F5E9',
	paddingVertical: 10,
	paddingHorizontal: 20,
	borderRadius: 20,
	borderWidth: 1,
	borderColor: '#66BB6A',
  },
  moreButtonText: {
	color: "#1B5E20",
	fontSize: 15,
	fontWeight: "700",
	textAlign: "center",
  },
  logoutButton: {
  backgroundColor: "#D32F2F",
  padding: 16,
  borderRadius: 25,
  alignSelf: "center",
  marginTop: 10,
  marginBottom: 15,
  elevation: 4,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  minWidth: 200,
},
logoutButtonText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 16,
  textAlign: "center",
},
});


