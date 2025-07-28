import { Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { COLOR, FONTS } from "../../constants/Theme";

const TravellerNames = ({name}) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.text}>{name}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  text: {
    backgroundColor: COLOR.primaryLight,
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: COLOR.primary,
    borderRadius: 6,
    fontFamily: FONTS.medium,
    borderWidth:.5,
    borderColor:COLOR.primary
  },
});

export default TravellerNames;
