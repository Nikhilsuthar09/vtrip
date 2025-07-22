import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";
import { Ionicons } from "@expo/vector-icons";

const PlanInAdvanceModal = ({ isVisible, onClose, onBackButtonPress, onAddExpense }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddExpense = () => {
    if (!category.trim()) {
      Alert.alert("Error", "Please enter an expense category");
      return;
    }
    
    if (!amount.trim() || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    // Add the expense
    onAddExpense({
      category: category.trim(),
      amount: amount.trim(),
    });


    // Reset form
    setCategory('');
    setAmount('');
    
    // Close modal
    onClose();
  };

  const handleClose = () => {
    // Reset form when closing without saving
    setCategory('');
    setAmount('');
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onBackButtonPress}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.heading}>Plan an Expense</Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Ionicons name="close" size={24} color={COLOR.grey} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Expense Type Input */}
              <Text style={styles.label}>Expense Type *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Hotel, Food, Transport"
                placeholderTextColor={COLOR.placeholder}
                value={category}
                onChangeText={setCategory}
                maxLength={50}
              />

              {/* Amount Input */}
              <Text style={styles.label}>Amount (in ₹) *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 5000"
                placeholderTextColor={COLOR.placeholder}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />

              {/* Add Button */}
              <TouchableOpacity 
                style={[
                  styles.addButton,
                  (!category.trim() || !amount.trim()) && styles.addButtonDisabled
                ]} 
                onPress={handleAddExpense}
                disabled={!category.trim() || !amount.trim()}
              >
                <Ionicons name="add-circle" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add Expense</Text>
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  heading: {
    fontSize: FONT_SIZE.H4,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  label: {
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.medium,
    color: COLOR.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLOR.stroke,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.textPrimary,
    backgroundColor: "#F9FAFB",
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: COLOR.primary,
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: COLOR.primary,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  addButtonDisabled: {
    backgroundColor: COLOR.grey,
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    color: "#fff",
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.bodyLarge,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLOR.stroke,
  },
  cancelButtonText: {
    color: COLOR.grey,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.bodyLarge,
  },
});

export default PlanInAdvanceModal;