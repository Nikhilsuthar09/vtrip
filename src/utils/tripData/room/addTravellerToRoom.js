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
    }
  } catch (e) {
    console.log(e);
    return {
      status: "Error",
      message: "Something went wrong please try again",
    };
  }
};

export const searchRoomIdInDb = async (roomId) => {
  try {
    const docRef = doc(db, "trip", roomId);
    const tripDocSnap = await getDoc(docRef);
    if (!tripDocSnap.exists()) {
      return null;
    }
    const ownerId = tripDocSnap.data().createdBy;
    const userDocSnap = await getDoc(doc(db, "user", ownerId));
    const ownerData = {
      token: userDocSnap.data()?.pushToken,
      name: userDocSnap.data()?.name,
      title: tripDocSnap.data()?.title,
      destination: tripDocSnap.data()?.destination,
    };
    console.log(ownerData)
    return ownerData;
  } catch (e) {
    console.log(e);
  }
};
