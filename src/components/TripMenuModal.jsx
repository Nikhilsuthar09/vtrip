import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from '@expo/vector-icons/AntDesign';

const TripMenuModal = ({visible, closeModal}) => {
  if(!visible) return null;
  return (
    <>
    {/* Backdrop */}
    <Pressable
    style={styles.backdrop}
    onPress={closeModal}
    />
    <View style={styles.container}>
      <View style={styles.iconTextContainer}>
        <Feather name="edit" size={18} color={COLOR.primary} />
        <Text style={styles.text}>Edit Trip</Text>
      </View>
      <View style={styles.iconTextContainer}>
        <Entypo name="share" size={18} color={COLOR.primary} />
        <Text style={styles.text}>Share Trip</Text>
      </View>
      <View style={styles.iconTextContainer}>
        <AntDesign name="delete" size={18} color={COLOR.primary} />
        <Text style={styles.text}>Delete Trip</Text>
      </View>
    </View>
    </>
  );
};
const styles = StyleSheet.create({
    backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  container: {
    position: "absolute",
    top: hp("6"),
    right: wp("8"),
    zIndex: 2,
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingLeft: 10,
    paddingRight: 40,
    borderRadius: 8,
    gap: 16,
    elevation: 10,
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"flex-start",
    gap: 6,
  },
  text: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.bodyLarge,
    color: COLOR.textSecondary,
  },
});

export default TripMenuModal;
