import { View, TouchableOpacity, StyleSheet, ScrollView, Text } from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLOR } from "../constants/Theme";
import AddPackingModal from "../components/Packing/AddPackingModal";
import { useTripPackingList } from "../utils/firebaseTripHandler";
import Spinner from "../components/Spinner";
import PackingListCard from "../components/Packing/PackingListCard";
import ProgressBar from "../components/Packing/ProgressBar";

const Packing = ({ route }) => {
  const { id } = route.params;
  const { packingData, loading, error } = useTripPackingList(id);
  const [isModalVisible, setIsModalVisible] = useState(false);
    const [isChecked, setChecked] = useState({});

  const packingByCategory = packingData.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});
  const totalItems = Object.values(packingByCategory).reduce(
    (sum, items) => sum + items.length,
    0)

    const toggleChecked = (itemId) => {
      setChecked((prev) => ({
        ...prev,
        [itemId]: !prev[itemId],
      }));
    };
    const totalChecked = Object.values(isChecked).filter(Boolean).length

  if (error) console.log(error);
  if (loading) return <Spinner />;
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        <ProgressBar
        progress = {`${totalChecked/totalItems}`}
        totalitems = {totalItems}
        />
      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.keys(packingByCategory)
          .sort()
          .map((category) => (
            <PackingListCard
              key={category}
              title={category}
              data={packingByCategory[category]}
              toggleChecked = {toggleChecked}
              isChecked = {isChecked}
            />
          ))}
      </ScrollView>
      <TouchableOpacity
        onPress={toggleModal}
        activeOpacity={0.8}
        style={styles.addIconContainer}
      >
        <Ionicons name="add" style={styles.icon} size={28} color="white" />
      </TouchableOpacity>
      <AddPackingModal
        isVisible={isModalVisible}
        onClose={toggleModal}
        tripId={id}
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
    elevation: 10,
  },
});
export default Packing;
