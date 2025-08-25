import {
  arrayUnion,
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
    else{
      return {status: "Error", message: "Trip doesn't exist"}
    }
  } catch (e) {
    console.log(e);
    return {
      status: "Error",
      message: "Something went wrong please try again",
    };
  }
};

export const searchRoomIdInDb = async (roomId, uid) => {
  try {
    const docRef = doc(db, "trip", roomId);
    const tripDocSnap = await getDoc(docRef);
    if (!tripDocSnap.exists()) {
      return { status: "Error", message: "Trip not found" };
    }
    const tripData = tripDocSnap.data();
    const ownerId = tripData.createdBy;
    if (ownerId === uid) {
      return {
        status: "Error",
        message: "You cannot join your own trip. Please enter a valid Trip ID.",
      };
    }
    const userDocSnap = await getDoc(doc(db, "user", ownerId));
    const userData = userDocSnap.data();
    const ownerData = {
      token: userData?.pushToken,
      uid: ownerId,
      name: userData?.name,
      title: tripData?.title,
      destination: tripData?.destination,
    };
    return ownerData;
  } catch (e) {
    console.log(e);
    return { status: "Error", message: "Something went wrong." };
  }
};

export const addNotificationToDb = async (
  ownerUid,
  requesterUid,
  tripId,
  type,
  status,
  message
) => {
  try {
    const notificationDocId = `${tripId}_${requesterUid}`;
    const userNotificationDoc = doc(
      db,
      "user",
      ownerUid,
      "notification",
      notificationDocId
    );
    const notificationDoc = {
      type,
      title: message.TITLE,
      body: message.BODY,
      requesterUid,
      tripId,
      status,
      createdAt: serverTimestamp(),
    };
    console.log(notificationDoc)
    await setDoc(userNotificationDoc, notificationDoc, { merge: true });
    console.log("notification added successfully");
    return { status: "Success", message: "notification add successfully" };
  } catch (e) {
    console.log(e);
    return {
      status: "Error",
      message: "Couldn't proceed with your request. Please try again later",
    };
  }
};
export const changeStatusInDb = async (uid, notiId, status) => {
  try {
    const notifiDocRef = doc(db, "user", uid, "notification", notiId);
    await updateDoc(notifiDocRef, {
      status,
    });
    return { status: "Successs", message: "Request rejected successfully" };
  } catch (e) {
    return {
      status: "Error",
      message: "Something went wrong, Please try again later",
    };
  }
};
