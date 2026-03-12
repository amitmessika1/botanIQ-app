import React from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "../_components/library/library/library/SearchBar";
import PlantCard from "../_components/library/library/library/PlantCard";
import PlantsListFooter from "../_components/library/library/library/PlantsListFooter";
import { usePlantsSearch } from "../_components/library/library/library/usePlantsSearch";


export default function Library() {
  const router = useRouter();
  const { q, setQ, items, loading, loadingMore, hasMore, loadMore } = usePlantsSearch();

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={styles.safeArea}>
      <Text style={styles.title}>ספריית צמחים</Text>
      <SearchBar value={q} onChange={setQ} />
      {loading && (
        <View style={styles.centerRow}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>טוען...</Text>
        </View>
      )}
      <FlatList
        data={items}
        numColumns={2}
        keyExtractor={(item) => item._id}
        onEndReachedThreshold={0.6}
        onEndReached={loadMore}
        renderItem={({ item }) => (
          <PlantCard item={item} onPress={() => router.push(`/plant/${item._id}`)} />
        )}
        ListEmptyComponent={!loading ? <Text style={styles.noResults}>לא נמצאו תוצאות</Text> : null}
        ListFooterComponent={
          <PlantsListFooter loadingMore={loadingMore} hasMore={hasMore} onLoadMore={loadMore} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 10,
  },
  centerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
  },
  loadingText: {
    color: "#64748b",
  },
  noResults: {
    textAlign: "center",
    paddingVertical: 20,
    color: "#64748b",
  },
});

