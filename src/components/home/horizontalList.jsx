import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";

const horizontalList = ({ item }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.recentTripCard}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=200&fit=crop",
        }}
        style={styles.recentTripImage}
      />
      <View style={styles.recentTripInfo}>
        <Text style={styles.recentTripDate}>{item.date}</Text>
        <Text style={styles.recentTripLocation}>{item.destination}</Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  recentTripCard: {
    marginBottom:10,
    width: 160,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recentTripImage: {
    width: "100%",
    height: 95,
  },
  recentTripInfo: {
    padding: 15,
  },
  recentTripDate: {
    fontSize: FONT_SIZE.caption,
    color: COLOR.grey,
    marginBottom: 5,
  },
  recentTripLocation: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.bodyLarge,
    color: "#1a1a1a",
  },
});

export default horizontalList;
