import { useCallback, useEffect, useState } from "react";
import { db } from "../Configs/firebaseConfig";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useAuth } from "../Context/AuthContext";

// hook to listen to the changes in tripIds array
export const useUserTrips = () => {
  const { uid } = useAuth();
  const [tripIds, setTripIds] = useState([]);
  const [idsError, setError] = useState(null);
  const [idsLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      setTripIds([]);
      return;
    }
    const userDocRef = doc(db, "user", uid);

    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const userTripIds = userData.tripIds || [];
          setLoading(false);
          setTripIds(userTripIds);
        } else {
          setLoading(false);
          console.log("User document does not exist");
        }
      },
      (err) => {
        console.log("Error listening to user document: ", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [uid]);
  return { tripIds, idsLoading, idsError };
};

// hook to fetch actual trip data based on trip ids
export const useUserTripsData = () => {
  const { tripIds, idsLoading, idsError } = useUserTrips();
  const [tripsData, setTripsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTripsData = useCallback(async () => {
    try {
      setLoading(true);
      if (tripIds.length == 0) {
        setTripsData([]);
        setLoading(false);
        return;
      }
      if (tripIds.length <= 10) {
        const tripsQuery = query(
          collection(db, "trip"),
          where(documentId(), "in", tripIds)
        );
        const querySnapshot = await getDocs(tripsQuery);
        const trips = [];
        querySnapshot.forEach((doc) => {
          trips.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        trips.sort((a, b) => {
          const dateA = new Date(a.startDate);
          const dateB = new Date(b.startDate);
          return dateA - dateB;
        });
        setTripsData(trips);
        setLoading(false);
      } else {
        // if trips array length is greater than 10
        const tripPromises = tripIds.map(async (tripId) => {
          try {
            const tripDocRef = doc(db, "trip", tripId);
            const tripDoc = await getDoc(tripDocRef);

            if (tripDoc.exists()) {
              return {
                id: tripDoc.id,
                ...tripDoc.data(),
              };
            } else {
              console.log(`TripId with Id ${tripId} not found`);
              return null;
            }
          } catch (e) {
            console.log(`Error fetching trip ${tripId}:`, e);
            return null;
          }
        });
        const trips = await Promise.all(tripPromises);
        const validTrips = trips.filter((trip) => trip !== null);
        validTrips.sort(
          (a, b) => new Date(a.startDate) - new Date(b.startDate)
        );
        setTripsData(validTrips);
      }
      setError(null);
    } catch (e) {
      console.log("Error fetching trips data: ", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [tripIds]);
  useEffect(() => {
    if (!idsError && !idsLoading) {
      fetchTripsData();
    }
  }, [tripIds, idsLoading, idsError]);
  return {
    tripsData,
    loading: idsLoading || loading,
    error: idsError || error,
    tripIds,
    refetch: fetchTripsData,
  };
};

//  function to add tripId to user's tripId array

export const AddTripToUser = async (tripId) => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const userDocRef = doc(db, "user", userId);
    const userDetails = {
      tripIds: arrayUnion(tripId),
    };
    await updateDoc(userDocRef, userDetails);
  } catch (e) {
    console.log(e.message);
  }
};

// function to create user in firestore
export const addUserToDb = async () => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const email = auth.currentUser.email;
    const name = auth.currentUser.displayName;
    const userDocRef = doc(db, "user", userId);
    const userDetails = {
      name,
      email,
    };
    await setDoc(userDocRef, userDetails);
  } catch (e) {
    console.log(e);
  }
};

