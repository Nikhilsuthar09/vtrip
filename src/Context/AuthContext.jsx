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

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!isRegistering) {
        setIsLoggedIn(!!user);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [isRegistering]);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
