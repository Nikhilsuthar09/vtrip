import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Itinerary from "../Screens/Itinerary";
import Packing from "../Screens/PackingScreen";
import Expenses from "../Screens/expenses/Expenses";
import { FONT_SIZE, FONTS } from "../constants/Theme";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text, View } from "react-native";

const Tab = createMaterialTopTabNavigator();

export default function TopTabs({ route }) {
  const { id } = route.params;
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontFamily: FONTS.semiBold,
          fontSize: FONT_SIZE.body,
        },
      }}
    >
      <Tab.Screen
        name="Itinerary"
        component={Itinerary}
        initialParams={{ id }}
        options={{
          tabBarLabel: ({ color }) => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome5 name="list-alt" size={16} color={color} />
              <Text
                style={{
                  color,
                  fontSize: FONT_SIZE.body,
                  fontFamily: FONTS.semiBold,
                  marginLeft: 4,
                }}
              >
                Itinerary
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Packing"
        initialParams={{ id }}
        component={Packing}
        options={{
          tabBarLabel: ({ color }) => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="card-travel" size={16} color={color} />
              <Text
                style={{
                  color,
                  fontSize: FONT_SIZE.body,
                  fontFamily: FONTS.semiBold,
                  marginLeft: 4,
                }}
              >
                Packing
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Expenses"
        initialParams={{ id }}
        component={Expenses}
        options={{
          tabBarLabel: ({ color }) => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome name="inr" size={16} color={color} />
              <Text
                style={{
                  color,
                  fontSize: FONT_SIZE.body,
                  fontFamily: FONTS.semiBold,
                  marginLeft: 4,
                }}
              >
                Expenses
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
