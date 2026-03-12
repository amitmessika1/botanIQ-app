import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import ActionButton from "./library/library/homeScreen/ActionButton";
import { deleteToken } from "../services/token";

export default function AppHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await deleteToken();
    router.replace("/loginScreen");
  };

  return (
    <View style={styles.row}>
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <ActionButton
        title="Logout"
        variant="danger"
        onPress={handleLogout}
        compact
      />
    </View>
  );
}

/*const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // שונה מ-space-between
    width: "100%",
    height: 44,
    paddingHorizontal: 12, // נוסף
  },
  logo: {
    width: 180, // הוגדל מ-140
    height: 36, // הוגדל מ-28
    marginRight: "auto", // נוסף - דחיפת הלוגאאוט לקצה הימני
  },
});*/

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    height: 44,
    paddingRight: 12, // רק מימין
  },
  logo: {
    width: 180,
    height: 40,
    marginRight: "auto",
    marginLeft: -50, // דחיפה שמאלה
  },
});