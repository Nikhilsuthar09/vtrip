import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import horizontalList from "../components/home/horizontalList";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserTripsData } from "../utils/firebaseUserHandlers";
import QuickActions from "../components/home/QuickActions";
import { getTripStatus } from "../utils/calendar/getTripStatus";
import { useAuth } from "../Context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useTravellerNames } from "../utils/firebaseTravellerHandler";

const TravelApp = ({onpress}) => {
  const { firstName, userNameChars } = useAuth();
  const { tripsData, loading, error, tripIds, refetch } = useUserTripsData();
  const navigation = useNavigation();
  const safeTripData = tripsData || [];

  // Get the primary trip to display (ongoing takes priority over upcoming)
  const primaryTrip = useMemo(() => {
    if (safeTripData.length === 0) return null;

    // First, check for ongoing trips
    const ongoingTrips = safeTripData.filter((trip) => {
      const status = getTripStatus(trip.startDate, trip.endDate);
      return status === "ongoing";
    });

    if (ongoingTrips.length > 0) {
      // If multiple ongoing trips, get the one that started most recently
      const sortedOngoing = ongoingTrips.sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      );
      return { ...sortedOngoing[0], status: "ongoing" };
    }

    // If no ongoing trips, look for upcoming trips
    const upcomingTrips = safeTripData.filter((trip) => {
      const status = getTripStatus(trip.startDate, trip.endDate);
      return status === "upcoming";
    });

    if (upcomingTrips.length > 0) {
      // Get the most upcoming trip (closest start date)
      const sortedUpcoming = upcomingTrips.sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      );
      return { ...sortedUpcoming[0], status: "upcoming" };
    }

    return null;
  }, [safeTripData]);

  const { travellerNames, travellerLoading, travellerError } =
    useTravellerNames(primaryTrip?.id);
  const safeTravellerNames = travellerNames || [];

  // Calculate trip timing text based on status
  const getTripTimingText = (trip) => {
    if (!trip) return "No active trips";

    const today = new Date();
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);

    if (trip.status === "ongoing") {
      const diffTime = endDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? `${diffDays} days remaining` : "Trip ending today";
    } else {
      // upcoming
      const diffTime = startDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? `${diffDays} days left` : "Trip starts today";
    }
  };

  // Get trip status indicator
  const getTripStatusIndicator = (trip) => {
    if (!trip) return "";
    return trip.status === "ongoing" ? "🌟 Ongoing" : "📅 Upcoming";
  };

  // get quick actions data
  const handleActionNavigation = (screen) => {
    if (primaryTrip) {
      const tripDetails = safeTripData.find(
        (item) => item.id === primaryTrip.id
      );
      navigation.navigate("TopTabs", {
        id: tripDetails.id,
        budget: tripDetails.budget,
        destination: tripDetails.destination,
        startDate: tripDetails.startDate,
        endDate: tripDetails.endDate,
        safeTravellerNames: safeTravellerNames,
        travellerLoading: travellerLoading,
        screen: screen,
      });
    }
  };
  const recentTrips = useMemo(() => {
    if (safeTripData.length === 0) return [];

    // Filter for completed trips
    const completedTrips = safeTripData.filter((trip) => {
      const status = getTripStatus(trip.startDate, trip.endDate);
      return status === "completed";
    });
    // Sort by end date (most recent first) and take first 3
    return completedTrips
      .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
      .slice(0, 3)
      .map((trip, index) => ({
        id: trip.id || index,
        date: new Date(trip.endDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        }),
        destination: trip.destination,
        imageUrl: trip?.imageUrl,
      }));
  }, [safeTripData]);
  const openDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, {firstName} 👋</Text>
            <Text style={styles.subtitle}>Ready for your next adventure?</Text>
          </View>
          <TouchableOpacity
            onPress={openDrawer}
            activeOpacity={0.8}
            style={styles.profileContainer}
          >
            <Text style={styles.profileText}>{userNameChars}</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Trip Card */}
        <View style={styles.tripCard}>
          <Image
            source={
              primaryTrip?.imageUrl || require("../../assets/default.jpg")
            }
            style={styles.tripImage}
          />
          <View style={styles.tripOverlay}>
            {/* Status indicator */}
            {primaryTrip && (
              <Text style={styles.tripStatus}>
                {getTripStatusIndicator(primaryTrip)}
              </Text>
            )}

            {/* Destination */}
            <Text style={styles.tripLocation}>
              {primaryTrip?.destination || "Plan your next trip"}
            </Text>

            {/* Timing and travelers info */}
            <View style={styles.tripDetails}>
              <Text style={styles.tripDuration}>
                {getTripTimingText(primaryTrip)}
              </Text>
              {primaryTrip?.travellers && (
                <Text style={styles.tripTravelers}>
                  • {primaryTrip.travellers.length || 1} Travelers
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <QuickActions onAddPress={onpress} onActionPress={handleActionNavigation} />

        {/* Recent Trips */}
        {recentTrips.length > 0 && (
          <View style={styles.recentTripsSection}>
            <View style={styles.recentTripsHeader}>
              <Text style={styles.sectionTitle}>Recent Trips</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>›</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={recentTrips}
              renderItem={horizontalList}
              keyExtractor={(item) => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 20, paddingRight: 20 }}
              style={styles.flatListStyle}
            />
          </View>
        )}
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
  sectionTitle: {
    fontSize: FONT_SIZE.H6,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 15,
  },
  tripStatus: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.medium,
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  tripDetails: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  tripTravelers: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.medium,
    color: "#fff",
    opacity: 0.9,
    marginLeft: 4,
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
    backgroundColor: "rgba(0,0,0,0.4)",
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
