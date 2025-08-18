import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Foundation from "@expo/vector-icons/Foundation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";

export const EmptyTripCard = ({ onPress }) => {
  return (
    <View style={styles.emptyTripCard}>
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.emptyTripGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.emptyTripContent}>
          <Foundation
            name="mountains"
            size={48}
            color="#fff"
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyTripTitle}>Ready for Adventure?</Text>
          <Text style={styles.emptyTripSubtitle}>
            Join an existing trip or create a new one
          </Text>
          <TouchableOpacity onPress={onPress} style={styles.createTripButton}>
            <Text style={styles.createTripButtonText}>Plan New Trip</Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color="#667eea"
              style={styles.buttonIcon}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};
const styles = StyleSheet.create({
  emptyTripCard: {
    height: 200,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 24,
    marginTop: 20,
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  emptyTripGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTripContent: {
    alignItems: "center",
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.9,
  },
  emptyTripTitle: {
    fontSize: FONT_SIZE.H6,
    fontFamily: FONTS.bold,
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyTripSubtitle: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.medium,
    color: "#fff",
    opacity: 0.9,
    textAlign: "center",
    marginBottom: 20,
  },
  createTripButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  createTripButtonText: {
    color: COLOR.secondary,
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.caption,
  },
  buttonIcon: {
    marginLeft: 2,
  },
});
