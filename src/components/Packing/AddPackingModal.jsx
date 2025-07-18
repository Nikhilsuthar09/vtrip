import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";
import { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import CreateNewCategory from "./CreateNewCategory";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../Configs/firebaseConfig";
import { handleAddPackingItem } from "../../utils/packing/firebaseAddHandler";
import { handleUpdateItem } from "../../utils/packing/firebaseUpdateHandler";
const AddPackingModal = ({
  isVisible,
  onClose,
  tripId,
  packingByCategory,
  editingItem,
}) => {
  const [packingListData, setPackingListData] = useState({});
  const [isNewCategoryModalVisible, setIsNewCategoryModalVisible] =
    useState(false);
  const [category, setCategory] = useState([
    { id: 1, name: "Essentials" },
    { id: 2, name: "Travelling" },
    { id: 3, name: "Food" },
    { id: 4, name: "Clothing" },
    { id: 5, name: "Electronics" },
  ]);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  useEffect(() => {
    if (!isVisible) return;
    if (editingItem) {
      setPackingListData({
        category: editingItem.category,
        item: editingItem.item,
        quantity: editingItem.quantity?.toString(),
        note: editingItem.note,
      });
    } else {
      resetData()
    }
  }, [editingItem, isVisible]);
  
  const resetData = () => {
    setPackingListData((prev) => ({
      ...prev,
      category: "",
      item: "",
      quantity: "",
      note: "",
    }));
  };

  useEffect(() => {
    if (!isVisible || !packingByCategory) return;
    const existingNames = new Set(category.map((cat) => cat.name));
    const newCategories = Object.keys(packingByCategory)
      .filter((name) => !existingNames.has(name))
      .map((name, index) => ({
        id: Date.now() + index,
        name,
      }));
    if (newCategories.length > 0) {
      setCategory((prev) => [...prev, ...newCategories]);
    }
  }, [isVisible, packingByCategory]);

  const handleAddCategory = () => {
    Keyboard.dismiss();
    if (!newCategoryInput.trim()) {
      Alert.alert("Please enter a category");
      return;
    }

    const categoryExists = category.some(
      (obj) => obj.name.toLowerCase() === newCategoryInput.trim().toLowerCase()
    );
    if (categoryExists) {
      Alert.alert("Category already exists!");
      return;
    }

    const newCategory = {
      id: category.length + 1,
      name: newCategoryInput.trim(),
    };
    setCategory((prev) => [...prev, newCategory]);
    setPackingListData((prev) => ({
      ...prev,
      category: newCategoryInput.trim(),
    }));
    toggleCategoryModal();
    setNewCategoryInput("");
  };

  const handlePackingListDataChange = (field, value) => {
    setPackingListData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleCategoryModal = () => {
    setIsNewCategoryModalVisible(!isNewCategoryModalVisible);
  };
  const handleSubmitItem = () => {
    if (editingItem) {
      updateItem();
    } else {
      addItem();
    }
  };

  const addItem = async () => {
    const success = await handleAddPackingItem(tripId, packingListData);
     if (success) {
      resetData();
      onClose();
    }
  };
  const updateItem = async () => {
    const success = await handleUpdateItem(tripId, editingItem.id, packingListData);
    if (success) {
      resetData();
      onClose();
    }
  };

  return (
    <Modal
      style={{ margin: 0 }}
      isVisible={isVisible}
      onBackButtonPress={onClose}
      animationIn="fadeIn"
      animationOut="fadeOut"
      avoidKeyboard={true}
    >
      <View style={styles.modalContainer}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeadingText}>Add new item</Text>
              <AntDesign
                onPress={onClose}
                name="close"
                size={24}
                color={COLOR.primary}
              />
            </View>
            <Text style={styles.categoryLabel}>
              Select your item's category...
            </Text>
            <View style={styles.categoryButtonsContainer}>
              {category.map((item) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={item.id}
                  style={[
                    styles.categoryButton,
                    packingListData.category === item.name &&
                      styles.selectedColor,
                  ]}
                  onPress={() =>
                    handlePackingListDataChange("category", item.name)
                  }
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      packingListData.category === item.name &&
                        styles.selectedTextColor,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={toggleCategoryModal}
                style={styles.addCategory}
              >
                <Ionicons
                  name="add"
                  style={styles.icon}
                  size={20}
                  color="white"
                />
                <Text style={styles.addCategoryText}>Add category</Text>
              </TouchableOpacity>
              <CreateNewCategory
                isNewCategoryModalVisible={isNewCategoryModalVisible}
                onCloseModal={toggleCategoryModal}
                input={newCategoryInput}
                setInput={setNewCategoryInput}
                onAdd={handleAddCategory}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.itemTextInputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  placeholder="Enter your item name"
                  style={styles.itemTextInput}
                  onChangeText={(value) =>
                    handlePackingListDataChange("item", value)
                  }
                  value={packingListData.item}
                />
              </View>
              <View style={styles.quantityInputContainer}>
                <Text style={[styles.label, { textAlign: "center" }]}>
                  qty.
                </Text>
                <TextInput
                  inputMode="numeric"
                  style={styles.quantityInput}
                  placeholder="0"
                  selectTextOnFocus={true}
                  onChangeText={(value) => {
                    const numericValue = value.replace(/[^0-9]/g, "");
                    const slicedinput = numericValue.slice(0, 3);
                    handlePackingListDataChange("quantity", slicedinput);
                  }}
                  value={packingListData.quantity}
                />
              </View>
            </View>
            <TextInput
              style={styles.noteinput}
              placeholder="Add a note (optional)"
              multiline={true}
              onChangeText={(value) =>
                handlePackingListDataChange("note", value)
              }
              value={packingListData.note}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={handleSubmitItem}
          style={styles.addButtonContainer}
        >
          <Text style={styles.addButtonText}>
            {editingItem ? "Update Item" : "Add Item"}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    flex: 1,
    justifyContent: "space-between",
    padding: 18,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
  },
  modalHeadingText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.H5,
    color: COLOR.textPrimary,
  },
  categoryButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: COLOR.grey,
    margin: 2,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    alignItems: "center",
  },
  categoryLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.body,
    color: COLOR.grey,
    paddingBottom: 10,
  },
  selectedColor: {
    backgroundColor: COLOR.secondary,
    borderColor: COLOR.secondary,
  },
  selectedTextColor: {
    color: "#FFF",
  },
  categoryButtonText: {
    fontFamily: FONTS.semiBold,
    color: COLOR.textSecondary,
  },
  addCategory: {
    paddingVertical: 6,
    paddingHorizontal: 10,

    flexDirection: "row",
    gap: 3,
    backgroundColor: COLOR.primary,
    borderRadius: 4,
    alignItems: "center",
  },
  addCategoryText: {
    fontFamily: FONTS.regular,
    color: "#FFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    width: "100%",
  },
  itemTextInputContainer: {
    width: "80%",
  },
  quantityInputContainer: {
    width: "20%",
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.caption,
    color: COLOR.grey,
    marginBottom: 2,
  },
  itemTextInput: {
    borderColor: COLOR.grey,
    borderWidth: 1,
    borderRightWidth: 0,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.bodyLarge,
    paddingHorizontal: 10,
  },
  quantityInput: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.bodyLarge,
    borderWidth: 1,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderColor: COLOR.grey,
    paddingHorizontal: 8,
    textAlign: "center",
    width: "100%",
  },
  noteinput: {
    paddingHorizontal: 6,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.bodyLarge,
    marginTop: 30,
    height: 120,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLOR.stroke,
  },
  addButtonContainer: {
    width: "100%",
    paddingVertical: 10,
    backgroundColor: COLOR.primary,
    borderRadius: 6,
    marginBottom: 16,
    marginTop: 10,
  },
  addButtonText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.bodyLarge,
    textAlign: "center",
    color: "#fff",
  },
});
export default AddPackingModal;
