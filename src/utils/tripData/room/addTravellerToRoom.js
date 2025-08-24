import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
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
    const tripData = tripDocSnap.data()
    const ownerId = tripData.createdBy;
    const userDocSnap = await getDoc(doc(db, "user", ownerId));
    const userData = userDocSnap.data()
    const ownerData = {
      token: userData?.pushToken,
      uid:ownerId,
      name: userData?.name,
      title: tripData?.title,
      destination:tripData?.destination,
    };
    console.log("ownerData", ownerData);
    return ownerData;
  } catch (e) {
    console.log(e);
  }
};

export const addNotificationToDb = async (ownerUid,requesterUid,tripId, type, status, message) => {
  try {
    const notificationDocId = `${tripId}_${requesterUid}`
    const userNotificationDoc = doc(db, "user", ownerUid, "notification",notificationDocId);
    const notificationDoc = {
      type,
      title:message.TITLE_JOIN,
      body: message.BODY_JOIN,
      requesterUid,
      tripId,
      status,
      createdAt: serverTimestamp(),
    };
    await setDoc(userNotificationDoc, notificationDoc,{merge:true});
    console.log("notification added successfully")
  } catch (e) {
    console.log(e)
  }
};
