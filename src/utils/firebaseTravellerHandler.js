import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../Configs/firebaseConfig";
import { getAuth } from "firebase/auth";

export const useTravellerNames = (tripId) => {
  const [travellerNames, setTravellerNames] = useState([]);
  const [travellerLoading, setLoading] = useState(true);
  const [travellerError, setError] = useState(null);
  const auth = getAuth()
  const uid = auth?.currentUser?.uid
  const name = auth?.currentUser?.displayName
  const email = auth?.currentUser?.email

  useEffect(() => {
    if (!tripId) {
      setLoading(false);
      return;
    }
    const fetchTravellerNames = async () => {
      try {
        setLoading(true);
        setError(null);
        const tripDoc = await getDoc(doc(db, "trip", tripId));
        if (!tripDoc.exists()) {
          throw new Error("Trip not found");
        }
        const { travellers } = tripDoc.data();
        console.log(travellers)
        if (!travellers || travellers.length === 0) {
          setTravellerNames([]);
          setLoading(false);
          return;
        }
        // return current user when there is only 1 traveller
        const names = [];
        if(travellers.length === 1){
          names.push({
             uid,
              name: name || "Unknown User",
              email: email || null,
          })
          setTravellerNames(names)
          setLoading(false);
          return;
        }


        // process in chunks of 10
        for (let i = 0; i < travellers.length; i += 10) {
          const batch = travellers.slice(i, i + 10);

          const usersQuery = query(
            collection(db, "user"),
            where(documentId(), "in", batch)
          );
          const querySnapshot = await getDocs(usersQuery);
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            names.push({
              uid: doc.id,
              name: userData.name || "Unknown User",
              email: userData.email || null,
            });
          });
        }
        setTravellerNames(names);
      } catch (e) {
        console.log("Error fetching traveller Names: ", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTravellerNames();
  }, [tripId]);
  return { travellerNames, travellerLoading, travellerError };
};
