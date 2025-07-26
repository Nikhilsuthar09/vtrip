import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import TrackOnTripModal from "../../components/expense/TrackOnTripModal";

const TrackOnTrip = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [expenseDataOnTrip, setExpenseDataOnTrip] = useState({
    name: "",
    expenseType: "",
    amount: "",
  });
  const handleExpenseDataChange = (field, value) => {
    setExpenseDataOnTrip((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const handleAddExpense = () => {
    console.log(expenseDataOnTrip);
    setModalVisible(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.summaryBox}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text
            style={[
              styles.summaryValue,
              // { color: isOverBudget ? COLOR.danger : COLOR.textPrimary },
            ]}
          >
            ₹300
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Budget</Text>
          <Text style={styles.summaryValue}>₹400</Text>
        </View>
      </View>

      {/* Remaining Amount */}
      <View style={styles.remainingBox}>
        <Text style={styles.remainingLabel}>Remaining</Text>
        <Text
          style={[
            styles.remainingAmount,
            // { color: isOverBudget ? COLOR.danger : COLOR.primary },
          ]}
        >
          ₹1500
        </Text>
      </View>

      {/* horizontal scrolling traveller names */}
      

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={toggleModal}>
        <Ionicons name="add" size={24} color={COLOR.actionText} />
      </TouchableOpacity>

      {/* Add Expense Modal */}
      <TrackOnTripModal
        modalVisible={modalVisible}
        onclose={toggleModal}
        handleDataChange={handleExpenseDataChange}
        expenseDataOnTrip={expenseDataOnTrip}
        onSubmit={handleAddExpense}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  summaryBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: FONT_SIZE.H5,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
  },
  divider: {
    width: 1,
    backgroundColor: COLOR.stroke,
    marginHorizontal: 20,
  },
  remainingBox: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  remainingLabel: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
    marginBottom: 4,
  },
  remainingAmount: {
    fontSize: FONT_SIZE.H5,
    fontFamily: FONTS.bold,
  },
  fab: {
    position: "absolute",
    bottom: 35,
    right: 25,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLOR.actionButton,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLOR.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
});
export default TrackOnTrip;
