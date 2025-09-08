import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../Configs/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  getfirstName,
  getuserNameChars,
} from "../utils/common/processUserData";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { addUserToDb } from "../utils/firebaseUserHandlers";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
const getUserData = async (user) => {
  try {
    const docSnap = await getDoc(doc(db, "user", user.uid));
    if (!docSnap.exists()) {
      if (GoogleSignin.hasPreviousSignIn()) {
        try {
          await addUserToDb(user);
          console.log("Created user document for Google sign-in user");
        } catch (error) {
          console.error("Failed to create user document:", error);
        }
      }
      const name = user.displayName;
      return {
        name: name || "User",
        uid: user.uid,
        email: user.email,
        firstName: name ? getfirstName(name) : "User",
        userNameChars: name ? getuserNameChars(name) : "U",
        user,
        imageUrl: user.photoURL || null,
      };
    }
    const data = docSnap.data();

    const uid = docSnap.id;
    const email = data.email;
    const name = data.name;
    const imageUrl = data?.imgUrl;

    const firstName = getfirstName(name);
    const userNameChars = getuserNameChars(name);
    return { name, uid, email, firstName, userNameChars, user, imageUrl };
  } catch (e) {
    console.error("Error processing user data:", e);
    const name = user.displayName;
    return {
      name: name || "User",
      uid: user.uid,
      email: user.email,
      firstName: name ? getfirstName(name) : "User",
      userNameChars: name ? getuserNameChars(name) : "U",
      user,
      imageUrl: user.photoURL || null,
    };
  }
};
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [userDetails, setUserDetails] = useState({
    name: null,
    uid: null,
    email: null,
    firstName: "User",
    userNameChars: "U",
  });

  const refreshUserData = async () => {
    setLoading(true);
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true; // Prevent state updates after unmount

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!isMounted) return;

        setUser(firebaseUser);

        if (firebaseUser) {
          // Get user data first, then update states
          const details = await getUserData(firebaseUser);

          if (isMounted) {
            setUserDetails(details);
          }
        } else {
          // Clear user details when no user
          if (isMounted) {
            setUserDetails({
              name: null,
              uid: null,
              email: null,
              firstName: "User",
              userNameChars: "U",
              imageUrl: null,
            });
          }
        }

        // Update login state after processing user data
        if (!isRegistering && isMounted) {
          setIsLoggedIn(!!firebaseUser);
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        if (isMounted && !isRegistering) {
          setIsLoggedIn(false);
        }
      } finally {
        // Always set loading to false, but only if component is still mounted
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [isRegistering, refreshTrigger]);

  const setRegistrationState = (state) => {
    setIsRegistering(state);
  };
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        isRegistering,
        setRegistrationState,
        user,
        refreshUserData,
        ...userDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
