import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import { Image } from "expo-image";
import SeparationLine from "./SeparationLine";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

const ShowTripsCard = ({
  id,
  title,
  destination,
  startDate,
  endDate,
  budget,
  openModal,
}) => {
  const navigation = useNavigation();
  const handleMenuPress = (itemId) => {
    return (e) => {
      console.log("tripcard:", itemId);
      e.currentTarget.measure((x, y, width, height, pageX, pageY) => {
        openModal({
          x: pageX,
          y: pageY + height,
          width,
          height,
          itemId: itemId,
        });
      });
    };
  };
  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity style={styles.menuIcon} onPress={handleMenuPress(id)}>
          <Entypo name="dots-three-vertical" size={18} color={COLOR.grey} />
        </TouchableOpacity>

        <View style={styles.imgcontainer}>
          <Image
            style={styles.image}
            source={require("./../../assets/default.jpg")}
            contentFit="cover"
            transition={500}
          />
        </View>
        <View style={styles.textcontainer}>
          <View style={styles.icon_text_container}>
            <View style={styles.iconContainer}>
              <FontAwesome name="map-marker" size={16} color={COLOR.grey} />
            </View>
            <Text style={styles.title}>
              {title} to {destination}
            </Text>
          </View>
          <View style={styles.icon_text_container}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="date-range" size={16} color={COLOR.grey} />
            </View>
            <Text style={styles.dates}>
              {startDate} - {endDate}
            </Text>
          </View>
          <View style={styles.icon_text_container}>
            <View style={styles.iconContainer}>
              <FontAwesome name="inr" size={16} color={COLOR.grey} />
            </View>
            <Text style={styles.bugdet}>{budget}</Text>
          </View>
          <Text style={styles.noOFdays}>
            {(() => {
              const days =
                Math.ceil(
                  (new Date(endDate) - new Date(startDate)) /
                    (1000 * 60 * 60 * 24)
                ) + 1;
              return `${days} ${days === 1 ? "Day" : "Days"}`;
            })()}
          </Text>
          <TouchableOpacity
            style={styles.planButton}
            onPress={() =>
              navigation.navigate("TopTabs", {
                id,
                budget,
                destination,
                startDate,
                endDate,
              })
            }
          >
            <Text style={styles.planButtontext}>Start Planning</Text>
          </TouchableOpacity>
        </View>
      </View>
      <SeparationLine />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    position: "relative",
    paddingVertical: 14,
    paddingHorizontal: 10,
    flexDirection: "row",
  },
  imgcontainer: {
    width: 120,
    height: 120,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    overflow: "hidden",
  },
  image: {
    height: "100%",
    width: "100%",
    backgroundColor: "#0553",
  },
  textcontainer: {
    flex: 2,
    gap: 6,
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 15,
    height: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  icon_text_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  menuIcon: {
    position: "absolute",
    right: 16,
    top: 6,
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    color: COLOR.textPrimary,
  },
  dates: {
    fontFamily: FONTS.medium,
    color: COLOR.grey,
    fontSize: FONT_SIZE.caption,
  },
  bugdet: {
    fontFamily: FONTS.medium,
    color: COLOR.grey,
    fontSize: FONT_SIZE.caption,
  },
  noOFdays: {
    fontFamily: FONTS.medium,
    color: COLOR.grey,
    fontSize: FONT_SIZE.caption,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: COLOR.stroke,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  planButton: {
    backgroundColor: COLOR.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginTop: 4,
  },
  planButtontext: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    color: COLOR.primary,
    textAlign: "center",
  },
});

export default ShowTripsCard;
