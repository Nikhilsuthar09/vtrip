import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./HomeScreen";
import Signup from "./Signup";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import AuthScreen from "./AuthScreen";
import { useEffect, useState } from "react";
import CreateTripButton from "./components/CreateTripButton";
import { Ionicons } from "@expo/vector-icons";
import { COLOR, FONT_SIZE, FONTS } from "./constants/Theme";
import AddTripModal from "./AddTripModal";
import MyTrip from "./MyTrip";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function RootStack() {
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
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
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

function HomeTabs() {
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            height: 65,
            paddingBottom: 5,
            paddingTop: 2,
          },
          tabBarActiveTintColor: COLOR.primary,
          tabBarInactiveTintColor: COLOR.grey,
          tabBarLabelStyle: {
            fontFamily: FONTS.medium,
            fontSize: FONT_SIZE.caption,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={22} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Center"
          component={EmptyComponent}
          options={{
            tabBarButton: (props) => (
              <CreateTripButton {...props} onPress={toggleModal}>
                <Ionicons name="add" size={28} color="white" />
              </CreateTripButton>
            ),
          }}
        />
        <Tab.Screen
          name="My Trips"
          component={MyTrip}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="airplane" size={22} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      <AddTripModal
        isModalVisible={isModalVisible}
        onClose={toggleModal}
        onBackButtonPressed={toggleModal}
        backdropPress={toggleModal}
      />
    </>
  );
}
function EmptyComponent() {
  return null;
}
