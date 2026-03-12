/*import React from "react";
import { FlatList, Text, StyleSheet } from "react-native";
import PlantTile from "./PlantTile";

export default function MyGardenGrid({ plants, onSelect }) {
  return (
    <FlatList
      data={plants}
      keyExtractor={(item) => String(item._id || item.id)}
      numColumns={2}
      renderItem={({ item }) => <PlantTile plant={item} onPress={() => onSelect(item)} />}
      ListEmptyComponent={<Text style={styles.emptyMessage}>הגינה שלך עדיין ריקה ⏳</Text>}
    />
  );
}

const styles = StyleSheet.create({
  emptyMessage: {
    textAlign: "center",
    fontSize: 18,
    color: "#66BB6A",
    marginTop: 40,
    fontWeight: "500",
  },
});*/

import React from "react";
import { FlatList, Text, StyleSheet } from "react-native";
import PlantTile from "./PlantTile";

export default function MyGardenGrid({
  plants,
  onSelect,
  ListHeaderComponent,
  ListFooterComponent,
}) {
  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={plants}
      keyExtractor={(item) => String(item._id || item.id)}
      numColumns={2}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <PlantTile plant={item} onPress={() => onSelect(item)} />
      )}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={
        <Text style={styles.emptyMessage}>הגינה שלך עדיין ריקה ⏳</Text>
      }
    />
  );
}

/*const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
 content: {
  paddingTop: 10,
  paddingBottom: 24,
  paddingHorizontal: 16,
},
  row: {
    justifyContent: "space-between",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 18,
    color: "#66BB6A",
    marginTop: 40,
    fontWeight: "500",
  },
});*/

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    paddingBottom: 18,
  },
  row: {
    justifyContent: "space-between",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#64748b",
    paddingVertical: 20,
    fontWeight: "600",
  },
});


