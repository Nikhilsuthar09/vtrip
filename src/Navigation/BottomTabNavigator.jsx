import { useState } from "react";
import HomeScreen from "../Screens/HomeScreen";
import MyTrip from "../Screens/MyTrip";
import AddTripModal from "../components/AddTripModal";
import CreateTripButton from "../components/CreateTripButton";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

function EmptyComponent() {
  return null;
}
export default function HomeTabs() {
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{
        animation: 'shift',
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
                <Ionicons name="add" size={28} color={COLOR.actionText} />
              </CreateTripButton>
            ),
          }}
        />
        <Tab.Screen
          name="My Trips"
          component={MyTrip}
          options={{
            headerShown: false,
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
