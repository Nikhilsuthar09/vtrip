import { useEffect, useState } from "react";
import { db } from "../Configs/firebaseConfig";
import {
  arrayUnion,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// hook to listen to the changes in tripIds array
export const useUserTrips = () => {
  const [tripIds, setTripIds] = useState([]);
  const [idsError, setError] = useState(true);
  const [idsLoading, setLoading] = useState(false);

  useEffect(() => {
    const userId = getAuth().currentUser.uid;
    const userDocRef = doc(db, "user", userId);

    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const userTripIds = userData.tripIds || [];
          setLoading(false);
          setTripIds(userTripIds);
          console.log("Trip Id updated: ", userTripIds);
        } else {
          console.log("User document does not exist");
        }
        setError(null);
      },
      (err) => {
        console.log("Error listening to user document: ", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);
  return { tripIds, idsLoading, idsError };
};

// hook to fetch actual trip data based on trip ids
export const useUserTripsData = () => {
  const { tripIds, idsLoading, idsError } = useUserTrips();
  const [tripsData, setTripsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchTripsData = async () => {
      try {
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
          console.log(trips);
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
          validTrips.sort((a, b) => {
            const dateA = new Date(a.startDate);
            const dateB = new Date(b.startDate);
            return dateA - dateB;
          });
          setTripsData(validTrips);
        }
        setError(null);
      } catch (e) {
        console.log("Error fetching trips data: ", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    if (!idsError && !idsLoading) {
      fetchTripsData();
    }
  }, [tripIds, idsLoading, idsError]);
  return {
    tripsData,
    loading: idsLoading || loading,
    error: idsError || error,
    tripIds,
  };
};

//  function to add tripId to user's tripId array

export const AddTripToUser = async (tripId) => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const email = auth.currentUser.email;
    const userDocRef = doc(db, "user", userId);
    const userDetails = {
      userId: userId,
      email: email,
      tripIds: arrayUnion(tripId),
    };
    await setDoc(userDocRef, userDetails, { merge: true });
  } catch (e) {
    console.log(e.message);
  }
};

