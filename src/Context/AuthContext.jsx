import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../Configs/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
const processUserData = (user) => {
  if (!user) {
    return {
      name: null,
      uid: null,
      email: null,
      firstName: "User",
      userNameChars: "U",
    };
  }

  const displayName = user.displayName;
  const uid = user.uid;
  const email = user.email;
  const name = displayName?.trim().replace(/\s+/g, " ");
  const splitted = name?.split(" ") || [];
  const firstName = splitted.length > 0 ? splitted[0] : "User";
  const userNameChars =
    splitted.length > 0
      ? splitted.length === 1
        ? splitted[0][0]
        : (
            splitted[0][0] + (splitted[splitted.length - 1][0] || "")
          ).toUpperCase()
      : "U";
  return { name, uid, email, firstName, userNameChars, user };
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
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setUserDetails(processUserData(firebaseUser));
      if (!isRegistering) {
        setIsLoggedIn(!!firebaseUser);
      }
      setLoading(false);
    });
    return unsubscribe;
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
