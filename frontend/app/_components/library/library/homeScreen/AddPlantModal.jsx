import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";

import { Image } from "expo-image";


import SearchBar from "../library/SearchBar";
import ActionButton from "./ActionButton";
import PlantsListFooter from "../library/PlantsListFooter";

// hook של ה-Library
import { usePlantsSearch } from "../library/usePlantsSearch";

// API שמוסיף צמח לגינה (POST /plants/:id/add-to-garden)
import { addPlantToGarden } from "../../../../services/api";

export default function AddPlantModal({ visible, onClose, onAdded }) {
  const {
    q,
    setQ,
    items,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    reload,
  } = usePlantsSearch();

  const [addingId, setAddingId] = useState(null);

  // כשפותחים את המודאל נטען עמוד ראשון. כשסוגרים נאפס חיפוש.
  useEffect(() => {
    if (visible) {
      reload();
    } else {
      setQ("");
      setAddingId(null);
    }
  }, [visible, reload, setQ]);

  const handleAdd = async (plantId) => {
    try {
      setAddingId(plantId);
      const res = await addPlantToGarden(plantId);

      if (!res || res.error || res.message) {
        Alert.alert("שגיאה", res?.error || res?.message || "הוספה נכשלה");
        return;
      }

      if (typeof onAdded === "function") onAdded(); // לא חובה, אבל שימושי לרענון הגינה במסך הבית
      Alert.alert("בוצע", "הצמח נוסף לגינה");
      if (typeof onAdded === "function") await onAdded();
      onClose?.();
    } catch (e) {
      Alert.alert("שגיאה", e?.message || "משהו השתבש");
    } finally {
      setAddingId(null);
    }
  };

  const renderItem = ({ item }) => {
    const title = item?.displayName || item?.name || item?.latin || "Unknown";
    const img = item?.image?.url ? { uri: item.image.url } : null;
    const isAdding = addingId === item?._id;

    return (
      <View style={styles.card}>
        {img ? (
          <Image
  source={{ uri: item.image.url }}
  style={styles.image}
  contentFit="cover"
/>

        ) : (
          <View style={styles.imagePlaceholder} />
        )}

        <Text style={styles.name} numberOfLines={2}>
          {title}
        </Text>

        <TouchableOpacity
          style={[styles.addBtn, isAdding && styles.addBtnDisabled]}
          onPress={() => handleAdd(item._id)}
          disabled={isAdding}
        >
          {isAdding ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.addBtnText}>הוסף לגינה</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>הוספת צמח לגינה</Text>

          <SearchBar value={q} onChange={setQ} />

          {loading ? (
            <View style={styles.centerRow}>
              <ActivityIndicator />
              <Text style={styles.loadingText}>טוען...</Text>
            </View>
          ) : (
            <FlatList
              data={items}
              numColumns={2}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              onEndReachedThreshold={0.6}
              onEndReached={loadMore}
              ListEmptyComponent={<Text style={styles.emptyText}>לא נמצאו תוצאות</Text>}
              ListFooterComponent={
                <PlantsListFooter
                  loadingMore={loadingMore}
                  hasMore={hasMore}
                  onLoadMore={loadMore}
                />
              }
            />
          )}

          <ActionButton
            title="סגירה"
            variant="primary"
            onPress={onClose}
            style={{ marginTop: 12, alignSelf: "stretch" }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    width: "92%",
    height: "82%",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    color: "#1B5E20",
  },
  centerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
  },
  loadingText: {
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#666",
  },
  footer: {
    paddingVertical: 14,
    alignItems: "center",
    gap: 8,
  },
  loadMoreBtn: {
    marginVertical: 12,
    alignSelf: "center",
    backgroundColor: "#E8F5E9",
    borderWidth: 1,
    borderColor: "#66BB6A",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
  },
  loadMoreText: {
    color: "#1B5E20",
    fontWeight: "700",
  },

  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    margin: 8,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  image: {
    width: "100%",
    height: 110,
    borderRadius: 12,
    marginBottom: 8,
  },
  imagePlaceholder: {
    width: "100%",
    height: 110,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#E5E7EB",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
    color: "#2E7D32",
  },
  addBtn: {
    backgroundColor: "#43A047",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  addBtnDisabled: {
    opacity: 0.7,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
