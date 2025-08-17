import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import { StatusBar } from "expo-status-bar";

const InviteCollaborators = ({ route }) => {
  const { id, travellers, destination, startDate, endDate, createdBy } =
    route.params;
  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Trip Info Card */}
        <View style={styles.tripCard}>
          <View style={styles.tripIconContainer}>
            <FontAwesome5 name="map-marked-alt" size={18} color="white" />
          </View>
          <View style={styles.tripInfo}>
            <Text style={styles.tripTitle}>{destination}</Text>
            <Text style={styles.tripDate}>
              {startDate} - {endDate}
            </Text>
          </View>
        </View>

        {/* Share Trip Code Section */}
        <View style={styles.section}>
          <View style={styles.codeContainer}>
            <View style={styles.sectionHeader}>
              <MaterialIcons
                name="share"
                size={20}
                style={{
                  padding: 10,
                  backgroundColor: COLOR.actionButton,
                  borderRadius: 50,
                }}
                color={COLOR.actionText}
              />
              <View style={styles.sectionHeaderText}>
                <Text style={styles.sectionTitle}>Share Trip Code</Text>
                <Text style={styles.sectionSubtitle}>
                  Share link or code with friends
                </Text>
              </View>
            </View>
            <View style={styles.codeBox}>
              <Text style={styles.codeLabel}>Trip Code</Text>
              <Text style={styles.codeText}>{id}</Text>
              <Text style={styles.codeDescription}>
                Anyone with this code can join your trip
              </Text>
            </View>

            <View style={styles.shareButtons}>
              <TouchableOpacity style={styles.shareLinkButton}>
                <Entypo name="export" size={18} color="white" />
                <Text style={styles.shareLinkText}>Share Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Current Collaborators Section */}
        <View style={styles.section}>
          <Text style={styles.collaboratorsTitle}>Current Travellers</Text>
          {travellers.map((item) => (
            <View key={item.uid} style={styles.collaboratorItem}>
              <View style={styles.collaboratorInfo}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={require("../../assets/default.jpg")}
                    style={styles.avatar}
                  />
                </View>
                <View style={styles.collaboratorDetails}>
                  <Text style={styles.collaboratorName}>{item.name}</Text>
                  {item.uid === createdBy && (
                    <Text style={styles.collaboratorRole}>Trip Organizer</Text>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
        {/* Continue to Trip Button */}
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Continue to Trip</Text>
          <AntDesign name="arrowright" size={18} color="white" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 15,
  },
  tripCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLOR.primaryLight,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
  },
  tripIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLOR.primary,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  tripInfo: {
    flex: 1,
  },
  tripTitle: {
    fontSize: FONT_SIZE.H6,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 2,
  },
  tripDate: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  sectionHeaderText: {
    marginLeft: 8,
    flex: 1,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.regular,
    color: "#666",
  },
  codeContainer: {
    backgroundColor: "#FAFAFA",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  codeLabel: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.light,
    color: COLOR.grey,
    // marginBottom: 8,
  },
  codeBox: {
    backgroundColor: COLOR.primaryLight,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 14,
    gap: 6,
  },
  codeText: {
    fontSize: FONT_SIZE.H3,
    fontFamily: FONTS.bold,
    color: COLOR.primary,
    letterSpacing: 2,
  },
  codeDescription: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
    textAlign: "center",
  },
  shareButtons: {
    flexDirection: "row",
    gap: 12,
  },
  shareLinkButton: {
    flex: 1,
    backgroundColor: COLOR.secondary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  shareLinkText: {
    color: "white",
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.semiBold,
    marginLeft: 6,
  },
  collaboratorsTitle: {
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 16,
  },
  collaboratorItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  collaboratorInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#dbeafe",
    flex: 1,
    padding: 9,
    borderRadius: 10,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  collaboratorDetails: {
    flex: 1,
  },
  collaboratorName: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 2,
  },
  collaboratorRole: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.regular,
    color: "#666",
  },
  continueButton: {
    backgroundColor: "#8B7CF6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginVertical: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  continueButtonText: {
    color: "white",
    fontSize: FONT_SIZE.H6,
    fontFamily: FONTS.semiBold,
    marginRight: 8,
  },
});

export default InviteCollaborators;
