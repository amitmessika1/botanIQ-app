import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
} from "react-native";

export default function HomeScreen() {
  const [plants, setPlants] = useState([
	{ id: '1', name: 'רוזמרין', image: { uri: 'https://www.peer-nursery.co.il/wp-content/uploads/2023/08/peer_27.jpg' }, details: 'זקוק להרבה שמש והשקיה מועטה.' },
	{ id: '2', name: 'לבנדר', image: { uri: 'https://m.media-amazon.com/images/I/71MICn447+L._AC_UF894,1000_QL80_.jpg' }, details: 'דורש אדמה מנוקזת והשקיה מתונה.' },
  ]);
  const [selectedPlant, setSelectedPlant] = useState(null);

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
		
		<Modal visible={!!selectedPlant} transparent animationType="slide">
		  <View style={styles.modalContainer}>
			<View style={styles.modalContent}>
			  <Image
				source={selectedPlant?.image}
				style={styles.modalImage}
				resizeMode="contain"
			  />
			  <Text style={styles.modalText}>{selectedPlant?.details}</Text>
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
	backgroundColor: "#E8F5E9",
  },
  container: {
	flex: 1,
	backgroundColor: "#E8F5E9",
	padding: 20,
  },
  title: {
	fontSize: 28,
	fontWeight: "bold",
	marginBottom: 15,
	textAlign: "center",
	color: "#2E7D32",
  },
  emptyMessage: {
	textAlign: "center",
	fontSize: 16,
	color: "#4CAF50",
	marginTop: 30,
  },
  plantCard: {
	flex: 1,
	backgroundColor: "#fff",
	borderRadius: 12,
	margin: 8,
	padding: 10,
	alignItems: "center",
	elevation: 3,
  },
  plantImage: {
	width: 80,
	height: 80,
  },
  plantName: {
	marginTop: 8,
	fontSize: 16,
	color: "#388E3C",
  },
  addButton: {
	backgroundColor: "#4CAF50",
	padding: 12,
	borderRadius: 20,
	alignSelf: "center",
	marginTop: 10,
  },
  addButtonText: {
	color: "#fff",
	fontWeight: "bold",
  },
  modalContainer: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0, 0.4)',
  justifyContent: 'center',
  alignItems: 'center',
},

modalContent: {
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 20,
  width: '85%',
  alignItems: 'center',
  elevation: 6, 
},

modalImage: {
  width: 150,
  height: 150,
  borderRadius: 75,
  marginBottom: 15,
},

modalTitle: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#2E7D32',
  marginBottom: 10,
  textAlign: 'center',
},

modalText: {
  fontSize: 16,
  color: '#4E4E4E',
  marginBottom: 20,
  textAlign: 'center',
  lineHeight: 22,
},

closeButtonContainer: {
  backgroundColor: '#4CAF50',
  borderRadius: 20,
  paddingVertical: 10,
  paddingHorizontal: 25,
},
closeButton: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},

  reminders: {
  marginTop: 25,
  backgroundColor: "#FFF9C4", 
  borderRadius: 16,
  padding: 18,
  borderWidth: 1,
  borderColor: "#FDD835", 
  shadowColor: "#000",
  shadowOpacity: 0.15,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 3, 
  alignItems: 'flex-end',
},
remindersTitle: {
  fontWeight: "bold",
  color: "#795548", 
  marginBottom: 8,
  fontSize: 18,
  textAlign: 'right',
},
reminderItem: {
  color: "#4E342E",
  marginBottom: 6,
  fontSize: 15,
  textAlign: 'right',
},

});


