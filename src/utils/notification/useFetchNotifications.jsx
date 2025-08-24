import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { usePushNotification } from "./useNotifications";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../Configs/firebaseConfig";

export const useFetchNotification = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { uid } = useAuth();
  const { notification } = usePushNotification();
  const debounceTimer = useRef(null);

  const fetchNotifications = async () => {
    if (!uid) return;
    setLoading(true);

    try {
      const q = query(
        collection(db, "user", uid, "notification"),
        orderBy("createdAt", "desc")
      );
      const snapShot = await getDocs(q);
      const data = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() ?? null,
      }));
      setNotifications(data);
    } catch (e) {
      console.log("error fetching notifications", e);
    } finally {
      setLoading(false);
    }
  };

  // initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [uid]);

  useEffect(() => {
    if (!notification) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      fetchNotifications();
    }, 800);
  }, [notification]);

  return { notifications, loading, refetch: fetchNotifications };
};
