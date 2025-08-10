// const handlelogout = async () => {
//   try {
//     await signOut(auth);
//     console.log("user signed out ");
//   } catch (e) {
//     console.error(e);
//   }
// };

//         <Pressable
//           onPress={handlelogout}
//           style={{
//             backgroundColor: "#007AFF",
//             paddingHorizontal: 20,
//             paddingVertical: 10,
//             borderRadius: 8,
//           }}
//         >
//           <Text style={{ color: "white", fontSize: FONT_SIZE.bodyLarge }}>logout</Text>
//         </Pressable>

import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Octicons from "@expo/vector-icons/Octicons";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import horizontalList from "../components/home/horizontalList";
import { SafeAreaView } from "react-native-safe-area-context";
import { firstName, userNameChars } from "../utils/common/getUserDetails";

const TravelApp = () => {
  const renderRecentTrips = [
    {
      id: 1,
      date: "26 Jun",
      destination: "goa",
    },
    {
      id: 2,
      date: "27 Jl",
      destination: "Alibaug",
    },
    {
      id: 3,
      date: "27 Jl",
      destination: "Alibaug",
    },
  ];
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, NIK 👋</Text>
            <Text style={styles.subtitle}>Ready for your next adventure?</Text>
          </View>
          <View style={styles.profileContainer}>
            <Text style={styles.profileText}>NS</Text>
          </View>
        </View>

        {/* Upcoming Trip Card */}
        <View style={styles.tripCard}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop",
            }}
            style={styles.tripImage}
          />
          <View style={styles.tripOverlay}>
            <Text style={styles.tripLocation}>destination</Text>
            <Text style={styles.tripDuration}>5 days left</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <FontAwesome6 name="add" size={24} color={COLOR.primary} />
              </View>
              <Text style={styles.actionLabel}>Add</Text>
              <Text style={styles.actionLabel}>New Trip</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
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

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <FontAwesome name="inr" size={24} color={COLOR.primary} />
              </View>
              <Text style={styles.actionLabel}>Track</Text>
              <Text style={styles.actionLabel}>Expenses</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Octicons name="checklist" size={24} color={COLOR.primary} />
              </View>
              <Text style={styles.actionLabel}>Packing</Text>
              <Text style={styles.actionLabel}>Checklist</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Trips */}
        <View style={styles.recentTripsSection}>
          <View style={styles.recentTripsHeader}>
            <Text style={styles.sectionTitle}>Recent Trips</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>›</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={renderRecentTrips}
            renderItem={horizontalList}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 20, paddingRight: 20 }}
            style={styles.flatListStyle}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  greeting: {
    fontSize: FONT_SIZE.H3,
    fontFamily: FONTS.semiBold,
    color: COLOR.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: COLOR.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  profileText: {
    color: "#fff",
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.body,
  },
  tripCard: {
    height: 150,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    position: "relative",
  },
  tripImage: {
    width: "100%",
    height: "100%",
  },
  tripOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingTop: 25,
    paddingLeft: 20,
  },
  tripLocation: {
    fontSize: FONT_SIZE.H3,
    fontWeight: "bold",
    color: "white",
    marginBottom: 3,
  },
  tripDuration: {
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.semiBold,
    color: "#fff",
    opacity: 0.9,
  },
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
  recentTripsSection: {
    marginBottom: 10,
  },
  recentTripsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 24,
    color: "#666",
    fontWeight: "300",
  },

  flatListStyle: {
    flexGrow: 0,
  },
});

export default TravelApp;
