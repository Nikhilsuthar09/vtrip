import { useEffect, useState } from "react";
import { db } from "../Configs/firebaseConfig";
import {
  collection,
  onSnapshot,
  orderBy,
  query as firestoreQuery,
} from "firebase/firestore";

const useTripPackingList = (tripId) => {
  const [packingData, setPackingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const collectionRef = collection(db, "trip", tripId, "packing");
    const packingQuery = firestoreQuery(
      collectionRef,
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      packingQuery,
      (snapshot) => {
        const packingList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPackingData(packingList);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [tripId]);
  return { packingData, loading, error };
};

const usePlannedExpense = (tripId) => {
  const [plannedExpenseData, setPlannedExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const collectionRef = collection(db, "trip", tripId, "plannedExpenses");
    const expenseQuery = firestoreQuery(
      collectionRef,
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      expenseQuery,
      (snapshot) => {
        const plannedExpenseList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlannedExpenseData(plannedExpenseList);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [tripId]);
  return { plannedExpenseData, loading, error };
};
const useOnTripExpense = (tripId) => {
  const [onTripExpenseData, setOnTripExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const collectionRef = collection(db, "trip", tripId, "onTripExpenses");
    const expenseQuery = firestoreQuery(
      collectionRef,
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      expenseQuery,
      (snapshot) => {
        const expenseList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() ?? null,
          updatedAt: doc.data().updatedAt?.toDate?.() ?? null,
        }));
        setOnTripExpenseData(expenseList);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [tripId]);
  return { onTripExpenseData, loading, error };
};

export { useTripPackingList, usePlannedExpense, useOnTripExpense };
