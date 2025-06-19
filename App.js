import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AuthScreen from "./src/AuthScreen";
import {
  Inter_700Bold,
  Inter_300Light,
  Inter_500Medium,
  Inter_400Regular,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./src/HomeScreen";
import Signup from "./src/Signup";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

function RootStack() {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setisLoggedIn(!!user);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ animation: "fade" }}>
      {isLoggedIn ? (
        <Stack.Screen name="Home" component={HomeScreen} />
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={Signup}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
export default function App() {
  const [loaded, error] = useFonts({
    Inter_700Bold,
    Inter_300Light,
    Inter_500Medium,
    Inter_400Regular,
    Inter_600SemiBold,
  });
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
