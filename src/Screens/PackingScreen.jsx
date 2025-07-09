import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLOR } from "../constants/Theme";
import AddPackingModal from "../components/Packing/AddPackingModal";


const Packing = () => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <TouchableOpacity
        onPress={toggleModal}
        activeOpacity={0.8}
        style={styles.addIconContainer}
      >
        <Ionicons name="add" style={styles.icon} size={28} color="white" />
      </TouchableOpacity>
      <AddPackingModal 
      isVisible={isModalVisible}
      onClose ={toggleModal}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  addIconContainer: {
    position: "absolute",
    bottom: 40,
    right: 30,
    width: 52,
    height: 52,
    borderRadius: 32.5,
    backgroundColor: COLOR.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
});
export default Packing;
