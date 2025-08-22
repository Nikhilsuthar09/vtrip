import { useFonts } from "expo-font";
import {
  Inter_700Bold,
  Inter_300Light,
  Inter_500Medium,
  Inter_400Regular,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./src/Navigation/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AirplaneLoading from "./src/components/AirplaneLoading";
import { AuthProvider } from "./src/Context/AuthContext";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
function handleRegistrationError(errorMessage) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        handleRegistrationError(
          "Permission not granted to get push token for push notification!"
        );
        return;
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        handleRegistrationError("Project ID not found");
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log(pushTokenString);
        return pushTokenString;
      } catch (e) {
        handleRegistrationError(`${e}`);
      }
    } else {
      handleRegistrationError(
        "Must use physical device for push notifications"
      );
    }
  }
}

export default function App() {
  const [minimumAnimationTime, setMinimumAnimationTime] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(undefined);
  const [loaded, error] = useFonts({
    Inter_700Bold,
    Inter_300Light,
    Inter_500Medium,
    Inter_400Regular,
    Inter_600SemiBold,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumAnimationTime(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((e) => setExpoPushToken(`${e}`));

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  if (!loaded && !error && !minimumAnimationTime) {
    return <AirplaneLoading />;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
