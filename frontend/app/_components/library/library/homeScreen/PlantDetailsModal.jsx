import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import ActionButton from "./ActionButton";
import { removePlantFromGarden } from "../../../../services/api";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function PlantDetailsModal({
  plant,
  visible,
  onClose,
  onMoreInfo,
  onRemoved,
  onWateredAt,
}) {
  const [removing, setRemoving] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickedDate, setPickedDate] = useState(new Date());

  // אם המודל פתוח אבל עדיין אין plant (קורה לפעמים בזמן מעבר סטייט)
  if (!visible) return null;

  const id = plant?._id || plant?.id;

  // תמיכה גם בדאטה ישן (תמונה מקומית) וגם בדאטה מהשרת (image.url)
  const imgSource =
    plant?.image?.url
      ? { uri: plant.image.url }
      : plant?.image
        ? plant.image
        : null;

  // טקסט – תני עדיפות לשדות מה־DB אם קיימים
  const title = plant?.displayName || plant?.name || plant?.latin || "Unknown";
    
     const lastWateredText = (() => {
      const v = plant?.lastWatered ?? plant?.lastWateredAt; // ✅
      if (!v) return "לא עודכן";
      const d = new Date(v);
      if (Number.isNaN(d.getTime())) return "לא עודכן";
      return d.toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit", year: "numeric" });
    })();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {imgSource ? (
            <Image source={imgSource} style={styles.modalImage} resizeMode="contain" />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}

          <Text style={styles.modalText}>{title}</Text>
          
          <Text style={styles.meta}>
            השקיה אחרונה: {lastWateredText}
          </Text>
     
          <ActionButton
            title="למידע נוסף..."
            variant="secondary"
            onPress={() => {
              if (!id) return;
              onMoreInfo?.(id);
            }}
            style={{ marginBottom: 12 }}
          />
          
          <ActionButton
          title="עדכן השקיה אחרונה"
          variant="primary"
         onPress={() => {
          const v = plant?.lastWatered ?? plant?.lastWateredAt; // ✅
          setPickedDate(v ? new Date(v) : new Date());
          setShowPicker(true);
          }}
          style={{ marginTop: 10 }}
        />

          {showPicker ? (
            <DateTimePicker
              value={pickedDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                if (event.type === "dismissed") {
                  setShowPicker(false);
                  return;
                }
                const chosen = date || pickedDate;
                setShowPicker(false);
                onWateredAt?.(plant._id || plant.id, chosen);
              }}
            />
          ) : null}


          <ActionButton
            title={removing ? "מסיר..." : "הסר מהגינה"}
            variant="danger"
            onPress={async () => {
              if (!id || removing) return;

              try {
                setRemoving(true);
                const res = await removePlantFromGarden(id);

                if (res?.ok) {
                  onRemoved?.(id); // מעדכן את HomeScreen להסיר מה־state
                  onClose?.();     // סוגר מודל
                }
              } finally {
                setRemoving(false);
              }
            }}
            style={{ marginTop: 12 }}
          />

          {removing && (
            <View style={{ marginTop: 10 }}>
              <ActivityIndicator />
            </View>
          )}

          <ActionButton
            title="סגירה"
            variant="primary"
            onPress={onClose}
            style={{ marginTop: 12 }}
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
    padding: 24,
    width: "85%",
    alignItems: "center",
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
  imagePlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginBottom: 20,
    backgroundColor: "#e2e8f0",
  },
  modalText: {
    fontSize: 17,
    color: "#424242",
    marginBottom: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  meta: {
  textAlign: "right",
  fontSize: 14,
  marginTop: 6,
  color: "#4E342E",
},
});

