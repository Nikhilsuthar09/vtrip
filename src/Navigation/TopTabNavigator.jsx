import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Itinerary from '../Screens/Itinerary';
import Packing from '../Screens/PackingScreen';
import Expenses from '../Screens/Expenses';

const Tab = createMaterialTopTabNavigator();

export default function TopTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Itinerary" component={Itinerary} />
      <Tab.Screen name="Packing" component={Packing} />
      <Tab.Screen name="Expenses" component={Expenses} />
    </Tab.Navigator>
  );
}