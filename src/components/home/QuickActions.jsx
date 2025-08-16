import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Octicons from "@expo/vector-icons/Octicons";
import React from "react";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";

const QuickActions = ({ onActionPress, onAddPress }) => {
  return (
    <View style={styles.quickActionsSection}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity onPress={onAddPress} style={styles.actionButton}>
          <View style={styles.actionIcon}>
            <FontAwesome6 name="add" size={24} color={COLOR.primary} />
          </View>
          <Text style={styles.actionLabel}>Add</Text>
          <Text style={styles.actionLabel}>New Trip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onActionPress("Itinerary")}
          style={styles.actionButton}
        >
          <View style={styles.actionIcon}>
            <FontAwesome6
              name="calendar-check"
              size={24}
              color={COLOR.primary}
            />
          </View>
          <Text style={styles.actionLabel}>View</Text>
          <Text style={styles.actionLabel}>Itinerary</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onActionPress("Expenses")}
          style={styles.actionButton}
        >
          <View style={styles.actionIcon}>
            <FontAwesome name="inr" size={24} color={COLOR.primary} />
          </View>
          <Text style={styles.actionLabel}>Track</Text>
          <Text style={styles.actionLabel}>Expenses</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onActionPress("Packing")}
          style={styles.actionButton}
        >
          <View style={styles.actionIcon}>
            <Octicons name="checklist" size={24} color={COLOR.primary} />
          </View>
          <Text style={styles.actionLabel}>Packing</Text>
          <Text style={styles.actionLabel}>Checklist</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  quickActionsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.H6,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    alignItems: "center",
    flex: 1,
  },
  actionIcon: {
    paddingBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  actionLabel: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.semiBold,
    color: COLOR.textSecondary,
  },
});

export default QuickActions;
