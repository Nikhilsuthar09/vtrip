import { useEffect, useState } from "react";
import { db } from "../Configs/firebaseConfig";
import { collection, onSnapshot, orderBy, query as firestoreQuery } from "firebase/firestore";

export const useTripPackingList = (tripId) => {
  const [packingData, setPackingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const collectionRef = collection(db, "trip", tripId, "packing");
      const packingQuery = firestoreQuery(collectionRef, orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(packingQuery, (snapshot) => {
        const packingList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPackingData(packingList);
      });
      return () => unsubscribe();
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);
  return { packingData, loading, error };
};
