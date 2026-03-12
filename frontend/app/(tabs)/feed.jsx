/*import React, { useEffect, useState } from "react";
import {View,Text,TextInput,TouchableOpacity,Image,StyleSheet,FlatList,ActivityIndicator,} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { getFeed, createPost, toggleLike, uploadImage } from "../services/api";
import { useRouter } from "expo-router";


export default function CommunityFeed() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null); // preview only (local file://)
  const [postsList, setPostsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

 const loadFeed = async () => {
  try {
    const data = await getFeed({ limit: 30 });
    setPostsList(Array.isArray(data) ? data : []);
  } catch (e) {
    if (e?.code === "UNAUTHORIZED") {
      router.replace("/loginScreen");
      return;
    }
    alert(e.message || "שגיאה בטעינת פיד");
    setPostsList([]);
  }
};


  useEffect(() => {
    (async () => {
      try {
        await loadFeed();
      } catch (e) {
        alert("שגיאה בטעינת פיד");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) setImage(result.assets[0].uri);
  };

const handlePost = async () => {
  if (!text.trim() && !image) {
    alert("לא כתבת שום דבר");
    return;
  }

  try {
    let imageUrl = "";

    // אם נבחרה תמונה – קודם מעלים אותה לשרת ומקבלים URL ציבורי
    if (image) {
      const up = await uploadImage(image);
      imageUrl = up.imageUrl || "";
    }

    const res = await createPost({ text, imageUrl });
    if (!res?.ok) {
      alert(res?.message || res?.error || "Post failed");
      return;
    }

    await loadFeed();
    setText("");
    setImage(null);
    } catch (e) {
    if (e?.code === "UNAUTHORIZED") {
      router.replace("/loginScreen");
      return;
    }
    alert(e.message || "שגיאה בפרסום פוסט");
  }
};

  const handleLike = async (postId) => {
    try {
      const res = await toggleLike(postId);
      if (!res?.ok) return;

      setPostsList((prev) =>
        prev.map((p) =>
          String(p._id) === String(postId)
            ? { ...p, likesCount: res.likesCount, likedByMe: res.likedByMe }
            : p
        )
      );
      } catch (e) {
        if (e?.code === "UNAUTHORIZED") {
        router.replace("/loginScreen");
        return;
    }
  };
  }

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadFeed();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={styles.safeArea}>
      <View style={styles.createPostBox}>
        <TextInput
          placeholder="What's on your mind?"
          value={text}
          onChangeText={setText}
          style={styles.postInput}
          multiline
        />

        {image && <Image source={{ uri: image }} style={styles.previewImage} />}

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.imageButton} onPress={handleImage}>
            <Text style={styles.imageButtonText}>📷</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.publishButton} onPress={handlePost}>
            <Text style={styles.publishButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={postsList}
        keyExtractor={(item) => String(item._id)}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.author}>
              {item.author?.username || "User"}:
            </Text>

            <Text style={styles.text}>{item.text}</Text>

            {!!item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
            )}

            <Text style={styles.time}>
              {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
            </Text>

            <TouchableOpacity
              style={styles.likeButton}
              onPress={() => handleLike(item._id)}
            >
              <Text style={styles.likeText}>
                👍 {item.likesCount ?? 0}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
    padding: 15,
  },
  createPostBox: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2,
  },
  postInput: {
    minHeight: 60,
    fontSize: 16,
    textAlign: "right",
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginTop: 10,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  imageButton: {
    backgroundColor: "#A5D6A7",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  imageButtonText: {
    color: "#1B5E20",
    fontWeight: "bold",
  },
  publishButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  publishButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  post: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  author: {
    fontWeight: "bold",
    color: "#1B5E20",
  },
  text: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  postImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 10,
  },
  likeButton: {
    alignSelf: "flex-start",
    backgroundColor: "#C8E6C9",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  likeText: {
    fontSize: 14,
    color: "#1B5E20",
  },
  time: {
    fontSize: 12,
    color: "#777",
    textAlign: "left",
    marginTop: 5,
    marginBottom: 7,
  },
});*/

/////////////////////////////////////////////////////////////

import React, { useEffect, useState } from "react";
import {View,Text,TextInput,TouchableOpacity,Image,StyleSheet,FlatList,ActivityIndicator,} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { getFeed, createPost, toggleLike, uploadImage } from "../services/api";
import { useRouter } from "expo-router";


export default function CommunityFeed() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null); // preview only (local file://)
  const [postsList, setPostsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

 const loadFeed = async () => {
  try {
    const data = await getFeed({ limit: 30 });
    setPostsList(Array.isArray(data) ? data : []);
  } catch (e) {
    if (e?.code === "UNAUTHORIZED") {
      router.replace("/loginScreen");
      return;
    }
    alert(e.message || "שגיאה בטעינת פיד");
    setPostsList([]);
  }
};


  useEffect(() => {
    (async () => {
      try {
        await loadFeed();
      } catch (e) {
        alert("שגיאה בטעינת פיד");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) setImage(result.assets[0].uri);
  };

const handlePost = async () => {
  if (!text.trim() && !image) {
    alert("לא כתבת שום דבר");
    return;
  }

  try {
    let imageUrl = "";

    // אם נבחרה תמונה – קודם מעלים אותה לשרת ומקבלים URL ציבורי
    if (image) {
      const up = await uploadImage(image);
      imageUrl = up.imageUrl || "";
    }

    const res = await createPost({ text, imageUrl });
    if (!res?.ok) {
      alert(res?.message || res?.error || "Post failed");
      return;
    }

    await loadFeed();
    setText("");
    setImage(null);
    } catch (e) {
    if (e?.code === "UNAUTHORIZED") {
      router.replace("/loginScreen");
      return;
    }
    alert(e.message || "שגיאה בפרסום פוסט");
  }
};

  const handleLike = async (postId) => {
    try {
      const res = await toggleLike(postId);
      if (!res?.ok) return;

      setPostsList((prev) =>
        prev.map((p) =>
          String(p._id) === String(postId)
            ? { ...p, likesCount: res.likesCount, likedByMe: res.likedByMe }
            : p
        )
      );
      } catch (e) {
        if (e?.code === "UNAUTHORIZED") {
        router.replace("/loginScreen");
        return;
    }
  };
  }

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadFeed();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={styles.safeArea}>
      <View style={styles.createPostBox}>
        <TextInput
          placeholder="What's on your mind?"
          value={text}
          onChangeText={setText}
          style={styles.postInput}
          multiline
        />

        {image && <Image source={{ uri: image }} style={styles.previewImage} />}

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.imageButton} onPress={handleImage}>
            <Text style={styles.imageButtonText}>📷</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.publishButton} onPress={handlePost}>
            <Text style={styles.publishButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={postsList}
        keyExtractor={(item) => String(item._id)}
        refreshing={refreshing}
        onRefresh={onRefresh}
renderItem={({ item }) => (
  <View style={styles.post}>
    {/* Header with avatar */}
    <View style={styles.postHeader}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {(item.author?.username || "U")[0].toUpperCase()}
        </Text>
      </View>
      <View style={styles.headerInfo}>
        <Text style={styles.author}>
          {item.author?.username || "User"}
        </Text>
        <Text style={styles.time}>
          {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
        </Text>
      </View>
    </View>

    <Text style={styles.text}>{item.text}</Text>

    {!!item.imageUrl && (
      <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
    )}

    {/* Like button at bottom */}
    <View style={styles.postFooter}>
      <TouchableOpacity
        style={[
          styles.likeButton,
          item.likedByMe && styles.likeButtonActive,
        ]}
        onPress={() => handleLike(item._id)}
      >
        <Text
          style={[
            styles.likeText,
            item.likedByMe && styles.likeTextActive,
          ]}
        >
          {item.likedByMe ? "❤️" : "🤍"} {item.likesCount ?? 0}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 15,
  },
  createPostBox: {
  backgroundColor: "white",
  padding: 15,
  borderRadius: 15,
  marginBottom: 10,
  elevation: 3,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},
  postInput: {
    minHeight: 60,
    fontSize: 16,
    textAlign: "right",
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginTop: 10,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  imageButton: {
    backgroundColor: "#A5D6A7",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  imageButtonText: {
    color: "#1B5E20",
    fontWeight: "bold",
  },
  publishButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  publishButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  post: {
  backgroundColor: "white",
  padding: 15,
  borderRadius: 12,
  marginBottom: 10,
  elevation: 2,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 3,
},
  author: {
  fontWeight: "600",
  fontSize: 15,
  color: "#1B5E20",
  marginBottom: 2,
},
  text: {
  marginBottom: 12,
  fontSize: 15,
  color: "#212121",
  lineHeight: 21,
},
  postImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 10,
  },
  likeButton: {
  backgroundColor: "#F5F5F5",
  paddingVertical: 6,
  paddingHorizontal: 14,
  borderRadius: 20,
  flexDirection: "row",
  alignItems: "center",
},
  likeText: {
  fontSize: 14,
  color: "#757575",
  fontWeight: "500",
},
  time: {
  fontSize: 12,
  color: "#999",
},
  safeArea: {
  flex: 1,
  backgroundColor: "#f8fafc",
},
postHeader: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 12,
},
avatar: {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: "#4CAF50",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 12,
},
avatarText: {
  color: "white",
  fontSize: 20,
  fontWeight: "bold",
},
headerInfo: {
  flex: 1,
},
postFooter: {
  borderTopWidth: 1,
  borderTopColor: "#E0E0E0",
  paddingTop: 10,
  marginTop: 10,
  flexDirection: "row",
  alignItems: "center",
},
likeButtonActive: {
  backgroundColor: "#FFEBEE",
  borderColor: "#EF5350",
  borderWidth: 1,
},
likeTextActive: {
  color: "#EF5350",
},
});

