import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import Signup from "../Screens/Signup";
import AuthScreen from "../Screens/AuthScreen";
import { useAuth } from "../Context/AuthContext";
import Spinner from "../components/Spinner";
import TopTabs from "./TopTabNavigator";
import HomeTabs from "./BottomTabNavigator";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Stack.Navigator screenOptions={{ animation: "fade" }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen
              name="BottomTabs"
              component={HomeTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TopTabs"
              component={TopTabs}
              options={{ headerShown: false }}
            />
          </>
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
    </SafeAreaView>
  );
}
