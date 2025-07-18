import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Text,
} from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import AddPackingModal from "../components/Packing/AddPackingModal";
import { useTripPackingList } from "../utils/firebaseTripHandler";
import Spinner from "../components/Spinner";
import PackingListCard from "../components/Packing/PackingListCard";
import ProgressBar from "../components/Packing/ProgressBar";
import Placeholder from "../components/Placeholder";
import TripMenuModal from "../components/TripMenuModal";
import { handleDeleteItem } from "../utils/packing/firebaseDeleteHandler";
import { handlePackedItems } from "../utils/packing/firebaseMarkAsPackedHandler";

const Packing = ({ route }) => {
  const { id } = route.params;
  const { packingData, loading, error } = useTripPackingList(id);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isChecked, setChecked] = useState({});
  const [modalData, setModalData] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [addbyCategory, setAddbyCategory] = useState(null);
  if (error) console.log(error);
  if (loading) return <Spinner />;

  const openMenu = (position) => {
    setModalData({
      visible: true,
      position,
      selectedItemId: position.itemId,
    });
  };
  const closeMenu = () => setModalData(null);
  const safePackingData = packingData || [];

  const checkedItems = safePackingData.filter((items) => items.isPacked).length;

  const packingByCategory = safePackingData.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});
  const totalItems = Object.values(packingByCategory).reduce(
    (sum, items) => sum + items.length,
    0
  );

  const toggleChecked = (itemId) => {
    setChecked((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };
  const totalChecked = Object.values(isChecked).filter(Boolean).length;

  const markAsPacked = async () => {
    const success = await handlePackedItems(id, isChecked);
    if (success) {
      setChecked({});
    }
  };

  const deleteItem = async (itemId) => {
    await handleDeleteItem(id, itemId);
  };
  const handleEditItem = async (itemId) => {
    const itemToEdit = safePackingData.find((item) => item.id === itemId);
    if (itemToEdit) {
      setEditItem(itemToEdit);
      toggleModal();
    }
  };
  const handleCloseModal = () => {
    setEditItem(null);
    setAddbyCategory(null)
    setIsModalVisible(!isModalVisible);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const handleAddByCategory = (category) => {
    if (category) {
      setAddbyCategory(category);
      toggleModal();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {safePackingData.length === 0 ? (
        <Placeholder onPress={toggleModal} />
      ) : (
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
          <ProgressBar
            progress={totalItems > 0 ? checkedItems / totalItems : 0}
            totalitems={totalItems}
          />
          {totalChecked !== 0 && (
            <View style={styles.actionButtonContainer}>
              <TouchableOpacity
                onPress={markAsPacked}
                style={[
                  styles.actionButton,
                  { backgroundColor: COLOR.primary },
                ]}
              >
                <Text style={styles.actionText}>Mark as packed</Text>
              </TouchableOpacity>
            </View>
          )}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.infoContainer}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color="#007AFF"
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                Tick the items you've packed...
              </Text>
            </View>
            {Object.keys(packingByCategory)
              .sort()
              .map((category, index, array) => (
                <PackingListCard
                  key={category}
                  title={category}
                  data={packingByCategory[category]}
                  toggleChecked={toggleChecked}
                  isChecked={isChecked}
                  openModal={openMenu}
                  isLast={index === array.length - 1}
                  handleAddByCategory={handleAddByCategory}
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
        </View>
      )}
      <TripMenuModal
        visible={modalData?.visible || false}
        closeModal={closeMenu}
        position={modalData?.position}
        selectedId={modalData?.selectedItemId}
        onDelete={deleteItem}
        onEdit={handleEditItem}
      />
      <AddPackingModal
        packingByCategory={packingByCategory}
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        tripId={id}
        editingItem={editItem}
        addbyCategory={addbyCategory}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  actionButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
  },
  actionText: {
    fontFamily: FONTS.semiBold,
    color: "#fff",
    fontSize: FONT_SIZE.caption,
  },
  infoContainer: {
    paddingVertical: 10,
    borderRadius: 12,
    marginVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    marginRight: 4,
  },
  infoText: {
    color: "#333",
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.semiBold,
  },
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
