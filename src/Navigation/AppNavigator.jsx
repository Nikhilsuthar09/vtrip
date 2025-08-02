import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Signup from "../Screens/Signup";
import AuthScreen from "../Screens/AuthScreen";
import { useAuth } from "../Context/AuthContext";
import Spinner from "../components/Spinner";
import TopTabs from "./TopTabNavigator";
import HomeTabs from "./BottomTabNavigator";
import PlanInAdvance from "../Screens/expenses/PlanInAdvance";
import TrackOnTrip from "../Screens/expenses/TrackOnTrip";
import ItineraryList from "../Screens/itinerary/ItineraryList";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  return (
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
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="itineraryList"
            component={ItineraryList}
            options={{
              title: "Itinerary",
              headerTitleStyle: {
                fontFamily: FONTS.semiBold,
                fontSize: FONT_SIZE.H5,
                color: "#333",
              },
              headerTitleAlign: "center",
              headerTintColor: COLOR.primary,
              headerShadowVisible: false,
            }}
          />

          <Stack.Screen
            name="PlanExpenseInAdvance"
            component={PlanInAdvance}
            options={{
              title: "Expenses",
              headerTitleStyle: {
                fontFamily: FONTS.semiBold,
                fontSize: FONT_SIZE.H6,
                color: "#333",
              },
              headerTintColor: COLOR.primary,
            }}
          />
          <Stack.Screen
            name="TrackOnTrip"
            component={TrackOnTrip}
            options={{
              title: "Expenses",
              headerTitleStyle: {
                fontFamily: FONTS.semiBold,
                fontSize: FONT_SIZE.H6,
                color: "#333",
              },
              headerTintColor: COLOR.primary,
            }}
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
  );
}
