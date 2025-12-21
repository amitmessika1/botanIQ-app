import React, { useState } from "react";
import {View,Text,TextInput,TouchableOpacity,Image,StyleSheet,FlatList,} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { posts } from "../data/posts";

export default function CommunityFeed() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [postsList, setPostsList] = useState(posts);

  const handleImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = () => {
    if (!text.trim() && !image) {
      alert("לא כתבת שום דבר");
      return;
    }
    const newPost = {
      id: Date.now().toString(),
      author: "New user",
      text,
      image,
      likes: 0,
      time: new Date().toLocaleString(),
    };
    setPostsList([newPost, ...postsList]); 
    setText("");
    setImage(null);
  };
  
  const handleLike = (id) => {
  setPostsList((prev) =>
    prev.map((post) =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    )
  );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.createPostBox}>
        <TextInput
          placeholder="What's on your mind?"
          value = {text}
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.author}>{item.author}:</Text>
            <Text style={styles.text}>{item.text}</Text>
            {item.image && (<Image source={{ uri: item.image }} style={styles.postImage} />)}
            <Text style={styles.time}>{item.time}</Text>
            <TouchableOpacity style={styles.likeButton} onPress={() => handleLike(item.id)}>
              <Text style={styles.likeText}>👍 {item.likes}</Text>
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

  postCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 1,
  },
  postText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "right",
  },
  postImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 10,
  },
  time: {
    textAlign: "left",
    color: "#777",
    fontSize: 12,
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

});

