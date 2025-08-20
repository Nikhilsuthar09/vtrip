import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../Configs/firebaseConfig";

export const addTravellerToRoom = async (roomId, uid) => {
  try {
    const docRef = doc(db, "trip", roomId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userDocRef = doc(db, "user", uid);
      await updateDoc(userDocRef, {
        tripIds: arrayUnion(roomId),
      });
      const tripDocRef = doc(db, "trip", roomId);
      await updateDoc(tripDocRef, {
        travellers: arrayUnion(uid),
      });
      return { status: "Success", message: "Trip added Successfully" };
    } else {
      return { status: "No trips found", message: "Please enter a valid code" };
    }
  } catch (e) {
    console.log(e);
    return {
      status: "Error",
      message: "Something went wrong please try again",
    };
  }
};
