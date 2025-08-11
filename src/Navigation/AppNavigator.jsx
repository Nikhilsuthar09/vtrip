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
import { Text, View } from "react-native";
import { formatDate } from "../utils/calendar/handleCurrentDate";

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
            options={({ route }) => ({
              headerTitle: () => {
                const title = route?.params?.destination;
                const subtitle = `${formatDate(
                  route?.params?.startDate
                )} - ${formatDate(route?.params?.endDate)}`;
                return (
                  <View style={{ paddingVertical: 4 }}>
                    <Text
                      style={{
                        fontFamily: FONTS.semiBold,
                        fontSize: FONT_SIZE.H6,
                        color: "#fff",
                      }}
                    >
                      {title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: FONTS.regular,
                        fontSize: FONT_SIZE.caption,
                        color: "#eee",
                        marginTop: 2,
                      }}
                    >
                      {subtitle}
                    </Text>
                  </View>
                );
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontFamily: FONTS.semiBold,
                fontSize: FONT_SIZE.H6,
              },
              headerStyle: {
                backgroundColor: COLOR.primary,
                height: 100,
              },
            })}
          />
          <Stack.Screen
            name="itineraryList"
            component={ItineraryList}
            options={{
              title: "Itinerary",
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontFamily: FONTS.semiBold,
                fontSize: FONT_SIZE.H6,
              },
              headerStyle: {
                backgroundColor: COLOR.primary,
              },
            }}
          />

          <Stack.Screen
            name="PlanExpenseInAdvance"
            component={PlanInAdvance}
            options={{
              title: "Planned Costs",
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontFamily: FONTS.semiBold,
                fontSize: FONT_SIZE.H6,
              },
              headerStyle: {
                backgroundColor: COLOR.primary,
              },
            }}
          />
          <Stack.Screen
            name="TrackOnTrip"
            component={TrackOnTrip}
            options={{
              title: "On-Trip Spending",
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontFamily: FONTS.semiBold,
                fontSize: FONT_SIZE.H6,
              },
              headerStyle: {
                backgroundColor: COLOR.primary,
              },
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
