import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
} from "react-native";
import { FONTS, FONT_SIZE, COLOR } from "../../constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import PlanInAdvanceModal from "../../components/expense/PlanInAdvanceModal";

const PlanInAdvance = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [expenses, setExpenses] = useState([
    { id: 1, category: "Hotel", amount: 5000 },
    { id: 2, category: "Food", amount: 2000 },
    { id: 3, category: "Transport", amount: 1500 },
  ]); // Sample expenses
  
  const budget = 10000; // Sample budget
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const budgetPercentage = Math.min((totalExpenses / budget) * 100, 100);
  const isOverBudget = totalExpenses > budget;

  const toggleModal = () => {
    setIsVisible(!isVisible);
  };

  const addExpense = (newExpense) => {
    const expense = {
      id: Date.now(),
      category: newExpense.category,
      amount: parseFloat(newExpense.amount) || 0,
    };
    setExpenses(prevExpenses => [...prevExpenses, expense]);
  };

  const removeExpense = (id) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
  };

  const renderExpenseItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseInfo}>
        <Text style={styles.expenseCategory}>{item.category}</Text>
        <Text style={styles.expenseAmount}>₹{item.amount}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeExpense(item.id)}
      >
        <Ionicons name="trash-outline" size={18} color={COLOR.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Budget Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[
          styles.progressBar,
          { backgroundColor: isOverBudget ? COLOR.danger : COLOR.primaryLight }
        ]}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${budgetPercentage}%`,
                backgroundColor: isOverBudget ? COLOR.danger : COLOR.primary,
              }
            ]}
          />
        </View>
        {isOverBudget && (
          <Text style={styles.overBudgetText}>Over Budget!</Text>
        )}
      </View>

      {/* Expense Summary Box */}
      <View style={styles.summaryBox}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text style={[
            styles.summaryValue,
            { color: isOverBudget ? COLOR.danger : COLOR.textPrimary }
          ]}>
            ₹{totalExpenses.toLocaleString()}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Budget</Text>
          <Text style={styles.summaryValue}>₹{budget.toLocaleString()}</Text>
        </View>
      </View>

      {/* Remaining Amount */}
      <View style={styles.remainingBox}>
        <Text style={styles.remainingLabel}>
          {isOverBudget ? 'Over Budget by' : 'Remaining'}
        </Text>
        <Text style={[
          styles.remainingAmount,
          { color: isOverBudget ? COLOR.danger : COLOR.primary }
        ]}>
          ₹{Math.abs(budget - totalExpenses).toLocaleString()}
        </Text>
      </View>

      {/* Expenses List */}
      <View style={styles.expensesContainer}>
        <Text style={styles.expensesTitle}>Planned Expenses</Text>
        {expenses.length > 0 ? (
          <FlatList
            data={expenses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderExpenseItem}
            showsVerticalScrollIndicator={false}
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
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Modal */}
      <PlanInAdvanceModal
        isVisible={isVisible}
        onClose={toggleModal}
        onBackButtonPress={toggleModal}
        onAddExpense={addExpense}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  progressBarContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
  overBudgetText: {
    marginTop: 8,
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.medium,
    color: COLOR.danger,
  },
  summaryBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
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
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
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
  expensesContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  expensesTitle: {
    fontSize: FONT_SIZE.H6,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 16,
  },
  expensesList: {
    paddingBottom: 100,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseCategory: {
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.medium,
    color: COLOR.textPrimary,
    marginBottom: 4,
  },
  expenseAmount: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
  },
  removeButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLOR.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLOR.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default PlanInAdvance;