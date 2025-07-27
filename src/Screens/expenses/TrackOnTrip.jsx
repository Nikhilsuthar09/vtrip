import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import TrackOnTripModal from "../../components/expense/TrackOnTripModal";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../Configs/firebaseConfig";
import { useOnTripExpense } from "../../utils/firebaseTripHandler";
import Spinner from "../../components/Spinner";
import ErrorScreen from "../../components/ErrorScreen";

const TrackOnTrip = ({ route }) => {
  const { id, budget } = route.params;
  const tripId = id || "";
  const safeBudget = budget || "";
  const { onTripExpenseData, loading, error } = useOnTripExpense(tripId);
  const [modalVisible, setModalVisible] = useState(false);
  const [expenseDataOnTrip, setExpenseDataOnTrip] = useState({
    name: "",
    expenseType: "",
    amount: "",
  });
  if (loading) return <Spinner />;
  if (error) {
    return <ErrorScreen />;
  }
  const safeTripData = onTripExpenseData || [];
  const totalExpenses = safeTripData.reduce((sum, expense) => {
    return sum + parseFloat(expense.amount);
  }, 0);
  const budgetPercentage = Math.min((totalExpenses / safeBudget) * 100, 100);
  const remaining = parseFloat(safeBudget) - totalExpenses;
  const isOverBudget = remaining < 0;

  const handleExpenseDataChange = (field, value) => {
    setExpenseDataOnTrip((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const handleAddExpense = async () => {
    const amount = parseFloat(expenseDataOnTrip.amount.trim());
    if (
      !expenseDataOnTrip.name.trim() ||
      !expenseDataOnTrip.expenseType.trim() ||
      !amount
    ) {
      Alert.alert("Invalid input");
      return;
    }
    if (isNaN(amount) || amount < 0) {
      Alert.alert("Invalid amount");
      return;
    }
    try {
      const expenseToStore = {
        paidBy: expenseDataOnTrip.name.trim(),
        expenseType: expenseDataOnTrip.expenseType.trim(),
        amount: parseFloat(expenseDataOnTrip.amount.trim()),
        createdAt: serverTimestamp(),
      };
      const expenseCollectionRef = collection(
        db,
        "trip",
        tripId,
        "onTripExpenses"
      );
      await addDoc(expenseCollectionRef, expenseToStore);
      console.log("expenses stored Successfully");
    } catch (e) {
      console.log(e);
    }
    setExpenseDataOnTrip({
      name: "",
      expenseType: "",
      amount: "",
    });
    setModalVisible(false);
  };
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[styles.expenseItem, index === 0 && styles.firstItem]}
      >
        <View style={styles.expenseInfo}>
          <Text style={styles.expenseCategory}>{item.expenseType}</Text>
          <Text style={styles.expenseAmount}>₹{item.amount}</Text>
        </View>
        <View>
          <Text style={styles.paidBy}>{item.paidBy}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* progress bar */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              backgroundColor: isOverBudget ? COLOR.danger : COLOR.primaryLight,
            },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${budgetPercentage}%`,
                backgroundColor: isOverBudget ? COLOR.danger : COLOR.primary,
              },
            ]}
          />
        </View>
        {isOverBudget && (
          <Text style={styles.overBudgetText}>Over Budget!</Text>
        )}
      </View>

      <View style={styles.summaryBox}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text
            style={[
              styles.summaryValue,
              { color: isOverBudget ? COLOR.danger : COLOR.textPrimary },
            ]}
          >
            ₹{totalExpenses.toLocaleString()}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Budget</Text>
          <Text style={styles.summaryValue}>
            ₹{safeBudget?.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Remaining Amount */}
      <View style={styles.remainingBox}>
        <Text style={styles.remainingLabel}>
          {isOverBudget ? "Over Budget by" : "Remaining"}
        </Text>
        <Text
          style={[
            styles.remainingAmount,
            { color: isOverBudget ? COLOR.danger : COLOR.primary },
          ]}
        >
          ₹{Math.abs(budget - totalExpenses).toLocaleString()}
        </Text>
      </View>

      {/* horizontal scrolling traveller names */}
      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          gap: 6,
          marginHorizontal: 20,
          alignSelf: "flex-start",
        }}
      >
        <Text
          style={{
            backgroundColor: COLOR.primaryLight,
            paddingVertical: 10,
            paddingHorizontal: 20,
            color: COLOR.primary,
            borderRadius: 6,
            fontFamily: FONTS.medium,
          }}
        >
          Nikhil
        </Text>
      </View>

      <View style={styles.expensesContainer}>
        <Text style={styles.expensesTitle}>Planned Expenses</Text>
        {safeTripData.length > 0 ? (
          <FlatList
            data={safeTripData}
            keyExtractor={(item) => item.id}
            renderItem={(item, index) => renderItem(item, index)}
            contentContainerStyle={styles.expensesList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="wallet-outline" size={48} color={COLOR.grey} />
            <Text style={styles.emptyStateText}>No expenses planned yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Tap the + button to add your first expense
            </Text>
          </View>
        )}
      </View>

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
  progressBarContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
    transition: "width 0.3s ease",
  },
  overBudgetText: {
    marginTop: 8,
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.medium,
    color: COLOR.danger,
  },
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
    bottom: 45,
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
  expensesContainer: {
    flex: 1,
    marginTop: 20,
  },
  expensesTitle: {
    fontSize: FONT_SIZE.H6,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginLeft: 20,
  },
  expensesList: {
    paddingBottom: 100,
    gap: 10,
  },
  firstItem: {
    marginTop: 16,
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 20,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseCategory: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.medium,
    color: COLOR.textPrimary,
    marginBottom: 4,
  },
  expenseAmount: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
  },
  paidBy: {
    fontFamily: FONTS.light,
    fontSize: FONT_SIZE.body,
    color: COLOR.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  emptyStateText: {
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.medium,
    color: COLOR.grey,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
export default TrackOnTrip;
