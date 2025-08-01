import React from "react";
import Feather from "@expo/vector-icons/Feather";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { COLOR, FONT_SIZE, FONTS } from "../../../constants/Theme";
import { useNavigation } from "expo-router";

const JourneyItem = ({ title, date, onPress, onMorePress }) => {
  return (
    <TouchableOpacity style={styles.journeyItem} onPress={onPress}>
      <View style={styles.journeyContent}>
        <View style={styles.journeyInfo}>
          <Text style={styles.journeyTitle}>{title}</Text>
          <View style={styles.dateContainer}>
            <Feather
              name="calendar"
              style={styles.calendarIcon}
              color={COLOR.placeholder}
            />
            <Text style={styles.dateText}>{date}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.moreButton} onPress={onMorePress}>
          <View style={styles.moreDotsContainer}>
            <View style={styles.moreDot} />
            <View style={styles.moreDot} />
            <View style={styles.moreDot} />
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const JourneysList = ({ tripData }) => {
  const navigation = useNavigation();
  // Function to calculate days between two dates
  const calculateDaysBetween = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end.getTime() - start.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1; // +1 to include both start and end dates
    return daysDifference;
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  // Function to add days to a date
  const addDays = (dateString, days) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split("T")[0];
  };

  // Generate journey days based on trip data
  const generateJourneyDays = () => {
    if (!tripData || !tripData.startDate || !tripData.endDate) {
      return [];
    }

    const totalDays = calculateDaysBetween(
      tripData.startDate,
      tripData.endDate
    );
    const journeyDays = [];

    for (let i = 0; i < totalDays; i++) {
      const currentDate = addDays(tripData.startDate, i);
      const formattedDate = formatDate(currentDate);

      let dayTitle;
      if (i === 0) {
        dayTitle = `${tripData.destination} first day`;
      } else if (i === totalDays - 1) {
        dayTitle = `Good Bye ${tripData.destination}`;
      } else {
        // Convert number to ordinal (1st, 2nd, 3rd, etc.)
        const getOrdinal = (n) => {
          const s = ["th", "st", "nd", "rd"];
          const v = n % 100;
          return n + (s[(v - 20) % 10] || s[v] || s[0]);
        };
        dayTitle = `${tripData.destination} ${getOrdinal(i + 1)} day`;
      }

      journeyDays.push({
        id: `day-${i + 1}`,
        title: dayTitle,
        date: formattedDate,
        dayNumber: i + 1,
        rawDate: currentDate,
      });
    }

    return journeyDays;
  };

  const journeyDays = generateJourneyDays();

  const renderJourneyItem = ({ item }) => {
    return (
      <JourneyItem
        title={item.title}
        date={item.date}
        onPress={() => {
          navigation.navigate("itineraryList", {item, tripData});
        }}
        onMorePress={() => {
          // Handle more options press
          console.log(`More options for ${item.title}`);
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Journey List */}
      <FlatList
        data={journeyDays}
        renderItem={renderJourneyItem}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  flatList: {
    flex: 1,
  },
  flatListContent: {
    padding: 20,
    paddingBottom: 100, // Space for add button
  },
  journeyItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  journeyContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  journeyInfo: {
    flex: 1,
  },
  journeyTitle: {
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.semiBold,
    color: COLOR.textSecondary,
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  calendarIcon: {
    marginRight: 6,
    fontSize: 14,
  },
  dateText: {
    fontSize: FONT_SIZE.body,
    color: "#666",
  },
  moreButton: {
    padding: 8,
    marginTop: -4,
  },
  moreDotsContainer: {
    alignItems: "center",
  },
  moreDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLOR.primary,
    marginVertical: 1,
  },
  separator: {
    height: 12,
  },
});

export default JourneysList;
