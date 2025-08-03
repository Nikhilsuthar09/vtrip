import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";
import { useNavigation } from "expo-router";

const Expenses = ({ route }) => {
  const { id, budget, safeTravellerNames } = route.params;
  const navigation = useNavigation();


  const handlePlanInAdv = () => {
    navigation.navigate("PlanExpenseInAdvance", {
      id: id,
      budget: budget,
    });
  };
  const trackOnTrip = () => {
    navigation.navigate("TrackOnTrip", {
      id: id,
      budget: budget,
      safeTravellerNames
    });
  };


  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>Tap a box below to begin</Text>

      <TouchableOpacity style={styles.dashedBox} onPress={handlePlanInAdv}>
        <Ionicons name="add-circle-outline" size={32} color={COLOR.primary} />
        <Text style={styles.boxTitle}>Plan in Advance</Text>
        <Text style={styles.boxSubtitle}>
          Set budgets for hotels, food, and transport before your trip starts.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.dashedBox} onPress={trackOnTrip}>
        <Ionicons name="add-circle-outline" size={32} color={COLOR.primary} />
        <Text style={styles.boxTitle}>Track During Trip</Text>
        <Text style={styles.boxSubtitle}>
          Log your expenses in real-time to stay on budget.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    justifyContent: "center",
  },
  instruction: {
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.medium,
    color: COLOR.grey,
    textAlign: "center",
    marginBottom: 24,
  },
  dashedBox: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: COLOR.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: COLOR.primaryLight + "20",
  },
  boxTitle: {
    fontSize: FONT_SIZE.H5,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginTop: 12,
    marginBottom: 6,
  },
  boxSubtitle: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
    textAlign: "center",
  },
});

export default Expenses;
