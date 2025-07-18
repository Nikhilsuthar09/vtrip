import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../Configs/firebaseConfig";
import { Alert } from "react-native";

const handleUpdateItem = async (tripId, editDocId, packingListData) => {
  if (!packingListData.category.trim()) {
    Alert.alert("Hold on!", "Choose a category to organize your item.");
    return false;
  }
  if (!packingListData.item.trim()) {
    Alert.alert("Missing Item Name", "Enter the packing item name to proceed.");
    return false;
  }
  const quantityStrToNumber = parseInt(packingListData.quantity);
  if (isNaN(quantityStrToNumber)) {
    Alert.alert("Error!", "Please enter a valid quantity");
    return false;
  }
  try {
    const itemToUpdate = {
      category: packingListData.category,
      item: packingListData.item,
      quantity: quantityStrToNumber,
      note: packingListData.note,
      upDatedAt: serverTimestamp(),
    };
    const itemDocRef = doc(db, "trip", tripId, "packing", editDocId);
    await updateDoc(itemDocRef, itemToUpdate);
    Alert.alert("Success!", "Item updated successfully");
    return true;
  } catch (e) {
    console.log("Error Updating Item", e);
    Alert.alert("Error Updating Item");
    return false;
  }
};

export { handleUpdateItem };
