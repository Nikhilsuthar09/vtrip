import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Modal from "react-native-modal";
import { COLOR, FONT_SIZE, FONTS } from "./constants/Theme";
import { StatusBar } from "expo-status-bar";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { CalendarList } from "react-native-calendars";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { getAuth } from "@firebase/auth";

const AddTripModal = ({
  isModalVisible,
  onClose,
  onBackButtonPressed,
  backdropPress,
}) => {
  const [activeInput, setActiveInput] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tripData, setTripData] = useState({
    title: "",
    destination: "",
    budget: "",
    start: "",
    end: "",
  });

  const handleTripDataChange = (field, value) => {
    setTripData((prevData) => ({
      ...prevData,
      [field]: value,
    }
  ));
  };
  // const validateTripData = () => {

  // }
  const handleStoreTripData = async () => {
    // validateTripData()
    if (!tripData.title.trim()) {
      Alert.alert("Please enter a title");
      return;
    }
    if (!tripData.destination.trim()) {
      Alert.alert("Please enter your destination");
      return;
    }
    if (!tripData.budget.trim()) {
      console.log("click");
      Alert.alert("Please enter your budget");
      return;
    }
    tripData.budget = parseInt(tripData.budget);
    if (isNaN(tripData.budget)) {
      Alert.alert("Please enter a valid amount");
      return;
    }
    try {
      const auth = getAuth();
      const uuid = auth.currentUser.uid;
      await setDoc(doc(db, "Room", uuid), tripData);
    } catch (e) {
      console.log(e);
    }
    setTripData({
      title: "",
      destination: "",
      budget: 0,
    });
    console.log(tripData);
  };

  const handleDayPress = (day) => {
    const selectedDate = day.dateString;

    if (!startDate || (startDate && endDate)) {
      // First selection or reset selection
      setStartDate(selectedDate);
      setEndDate("");
    } else if (startDate && !endDate) {
      // Second selection
      const startDateObj = new Date(startDate);
      const selectedDateObj = new Date(selectedDate);
      if (selectedDateObj >= startDateObj) {
        setEndDate(selectedDate);
      } else {
        // If selected date is before start date, make it the new start date
        setStartDate(selectedDate);
        setEndDate("");
      }
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  // create marked date objects
  const getMarkedDates = () => {
    let markedDates = {};
    if (startDate && endDate) {
      // range selection
      markedDates = getDatesInRange(startDate, endDate);
      markedDates[startDate] = {
        ...markedDates[startDate],
        startingDay: true,
        color: "#4D81E7",
        textColor: "white",
      };
      markedDates[endDate] = {
        ...markedDates[endDate],
        endingDay: true,
        color: "#4D81E7",
        textColor: "white",
      };
    } else if (startDate) {
      markedDates[startDate] = {
        startingDay: true,
        endingDay: true,
        color: "#4D81E7",
        textColor: "white",
      };
    }

    return markedDates;
  };
  const getDatesInRange = (start, end) => {
    const dates = {};
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);

    if (startDateObj > endDateObj) return dates;

    const currentDate = new Date(startDateObj);
    while (currentDate <= endDateObj) {
      const dateString = currentDate.toISOString().split("T")[0];
      dates[dateString] = {
        color: "#4D81E7",
        textColor: "white",
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const resetDates = () => {
    setStartDate("");
    setEndDate("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  return (
    <Modal
      isVisible={isModalVisible}
      onBackButtonPress={onBackButtonPressed}
      onBackdropPress={backdropPress}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modal} // Remove default margins
    >
      <ScrollView>
        <StatusBar style="dark" />
        <View style={styles.modalContainer}>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Create New Trip</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.inputContainer}>
              <AntDesign
                name="tags"
                size={20}
                color="#4D81E7"
                style={styles.icon}
              />
              <TextInput
                onChangeText={(text) => handleTripDataChange("title", text)}
                value={tripData.title}
                onFocus={() => setActiveInput("title")}
                onBlur={() => setActiveInput(null)}
                placeholder="Title"
                placeholderTextColor="#8F9098"
                style={[
                  styles.input,
                  activeInput === "title"
                    ? styles.activeColor
                    : styles.inactiveColor,
                ]}
              />
            </View>
            <View style={styles.inputContainer}>
              <FontAwesome
                name="map-marker"
                size={20}
                color="#4D81E7"
                style={styles.icon}
              />
              <TextInput
                placeholder="Destination"
                placeholderTextColor="#8F9098"
                onChangeText={(text) =>
                  handleTripDataChange("destination", text)
                }
                value={tripData.destination}
                onFocus={() => setActiveInput("destination")}
                onBlur={() => setActiveInput(null)}
                clearTextOnFocus={true}
                style={[
                  styles.input,
                  activeInput === "destination"
                    ? styles.activeColor
                    : styles.inactiveColor,
                ]}
              />
            </View>
            <View style={styles.inputContainer}>
              <FontAwesome
                name="inr"
                size={20}
                color="#4D81E7"
                style={styles.icon}
              />
              <TextInput
                placeholder="Budget"
                placeholderTextColor="#8F9098"
                onChangeText={(text) => handleTripDataChange("budget", text)}
                value={tripData.budget}
                keyboardType="numeric"
                onFocus={() => setActiveInput("budget")}
                onBlur={() => setActiveInput(null)}
                clearTextOnFocus={true}
                style={[
                  styles.input,
                  activeInput === "budget"
                    ? styles.activeColor
                    : styles.inactiveColor,
                ]}
              />
            </View>
            {/* Date Selection Info */}
            <View style={styles.dateInfoContainer}>
              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>Start Date:</Text>
                <Text style={styles.dateText}>
                  {startDate ? formatDate(startDate) : "Select start date"}
                </Text>
              </View>
              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>End Date:</Text>
                <Text style={styles.dateText}>
                  {endDate ? formatDate(endDate) : "Select end date"}
                </Text>
              </View>
              {(startDate || endDate) && (
                <Pressable style={styles.resetButton} onPress={resetDates}>
                  <Text style={styles.resetButtonText}>Reset Dates</Text>
                </Pressable>
              )}
            </View>

            <View>
              <Text style={styles.calendarInstruction}>
                {!startDate
                  ? "Tap to select start date"
                  : !endDate
                  ? "Tap to select end date"
                  : `${
                      Math.ceil(
                        (new Date(endDate) - new Date(startDate)) /
                          (1000 * 60 * 60 * 24)
                      ) + 1
                    } days selected`}
              </Text>

              <CalendarList
                onDayPress={handleDayPress}
                markedDates={getMarkedDates()}
                minDate={getCurrentDate()}
                markingType="period"
                horizontal={true}
                pagingEnabled={true}
                pastScrollRange={0}
                futureScrollRange={12}
                calendarWidth={320}
                calendarHeight={340}
                current={getCurrentDate()}
                theme={{
                  fontFamily: FONTS.regular,
                  selectedDayBackgroundColor: "#4D81E7",
                  selectedDayTextColor: "#ffffff",
                  todayTextColor: "#4D81E7",
                  dayTextColor: "#2d4150",
                  textDisabledColor: "#d9e1e8",
                  monthTextColor: "#2d4150",
                  indicatorColor: "#4D81E7",
                }}
              />
            </View>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleStoreTripData}
            >
              <Text style={styles.createButtonText}>Create Trip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  modalContainer: {
    flex: 1,
    gap: 30,
    backgroundColor: "#fff",
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  headingContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heading: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.H4,
    color: COLOR.textPrimary,
  },
  icon: {
    position: "absolute",
    top: 18,
    left: 10,
  },
  inputContainer: {
    position: "relative",
    flexDirection: "row",
  },
  input: {
    flex: 1,
    fontFamily: FONTS.medium,
    color: COLOR.textSecondary,
    fontSize: FONT_SIZE.body,
    borderRadius: 10,
    height: 55,
    paddingLeft: 32,
    marginBottom: 20,
    borderWidth: 2,
  },
  activeColor: {
    borderColor: COLOR.primary,
  },
  inactiveColor: {
    borderColor: COLOR.stroke,
  },
  closeButton: {
    width: 100,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: COLOR.primary,
  },
  closeButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    color: "#fff",
  },
  dateInfoContainer: {
    backgroundColor: COLOR.stroke,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dateLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.body,
    color: COLOR.textSecondary,
  },
  dateText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    color: COLOR.textPrimary,
  },
  resetButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLOR.danger,
    borderRadius: 6,
    marginTop: 5,
  },
  resetButtonText: {
    color: "white",
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.caption,
  },
  calendarInstruction: {
    textAlign: "center",
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    color: COLOR.secondary,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: COLOR.primary,
    paddingVertical: 10,
    borderRadius: 10,
  },
  createButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.H5,
    textAlign: "center",
    color: "#fff",
  },
});

export default AddTripModal;
