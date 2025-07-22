import { View, Text, Pressable } from "react-native";
import React from "react";
import { auth } from "../Configs/firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { FONT_SIZE } from "../constants/Theme";
import { signOut } from "firebase/auth";

const handlelogout = async () => {
  try {
    await signOut(auth);
    console.log("user signed out ");
  } catch (e) {
    console.error(e);
  }
};

const HomeScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 20 }}>
          Home
        </Text>
        <Pressable
          onPress={handlelogout}
          style={{
            backgroundColor: "#007AFF",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white", fontSize: FONT_SIZE.bodyLarge }}>logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
