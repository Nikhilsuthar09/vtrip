import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import { Image } from "expo-image";
import SeparationLine from "./SeparationLine";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "expo-router";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const ShowTripsCard = ({ title, destination, startDate, endDate, budget }) => {
  const navigation = useNavigation();
  return (
    <>
      <View style={styles.container}>
        <View style={styles.imgcontiner}>
          <Image
            style={styles.image}
            source={require("./../../assets/default.jpg")}
            placeholder={{ blurhash }}
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
            {`${
              Math.ceil(
                (new Date(endDate) - new Date(startDate)) /
                  (1000 * 60 * 60 * 24)
              ) + 1
            } Days`}
          </Text>
          <TouchableOpacity
            style={styles.planButton}
            onPress={() => navigation.navigate("TopTabs")}
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
    paddingVertical: 14,
    paddingHorizontal: 10,
    flexDirection: "row",
    marginBottom: 10,
  },
  imgcontiner: {
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
  title: {
    fontFamily: FONTS.bold,
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
    backgroundColor: COLOR.primary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginTop: 4,
  },
  planButtontext: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    color: "#fff",
    textAlign: "center",
  },
});

export default ShowTripsCard;
