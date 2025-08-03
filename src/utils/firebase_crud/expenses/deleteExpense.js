import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../Configs/firebaseConfig";
import { Alert } from "react-native";

export const deleteExpense = async (tripId, itemId, expensePathName) => {
  try {
    const itemDocRef = doc(db, "trip", tripId, expensePathName, itemId);
    await deleteDoc(itemDocRef);
    Alert.alert("Success!", "Item deleted Successfully");
  } catch (e) {
    console.error("Failed to delete the item", e);
    Alert.alert("Error!", "Something went wrong");
  }
};
