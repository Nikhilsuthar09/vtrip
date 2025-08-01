import { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../Configs/firebaseConfig";
import { formatTime } from "../../utils/calendar/formatTime";

const AddItemModal = ({ visible, onClose, listData }) => {
  const [time, setTime] = useState(new Date());
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleClose = () => {
    // Reset form when closing
    setTime(new Date());
    setTitle("");
    setSubtitle("");
    setShowTimePicker(false);
    onClose();
  };

  const onTimeChange = (event, selectedTime) => {
      setShowTimePicker(false); 
    
    if (selectedTime) {
      setTime(selectedTime);
    }
  };
  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };


  const handleAddItem = async() => {
    if(!title){
      Alert.alert("No title", "Please enter a title for you activity..")
      return
    }
    if(!subtitle){
      Alert.alert("No subtitle", "Please enter a subtitle for your activity..")
      return
    }
    try{
      const itineraryToStore = {
        time: time,
        title,
        subtitle
      }
      const tripDayCollectionRef = collection(db, "trip", listData.tripData.id, listData.item.id)
      await addDoc(tripDayCollectionRef, itineraryToStore)
      handleClose()
      console.log("Success itinerary stored ")
    }
    catch(e){
      console.log(e)
    }

  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Item</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLOR.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Time</Text>
              <TouchableOpacity onPress={showTimePickerModal}>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={styles.textInputWithIcon}
                    value={formatTime(time)}
                    placeholder="e.g., 09:00 AM"
                    placeholderTextColor={COLOR.placeholder}
                    editable={false} 
                    pointerEvents="none" 
                  />
                  <MaterialCommunityIcons
                    style={styles.inputIcon}
                    name="clock-time-nine-outline"
                    size={20}
                    color={COLOR.placeholder}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {showTimePicker && (
              <DateTimePicker
                testID="timePicker"
                value={time}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={onTimeChange}
              />
            )}
              <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Breakfast"
                placeholderTextColor={COLOR.placeholder}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Subtitle</Text>
              <TextInput
                style={styles.textInput}
                value={subtitle}
                onChangeText={setSubtitle}
                placeholder="e.g., Local Cafe"
                placeholderTextColor={COLOR.placeholder}
              />
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAddItem} style={[styles.modalButton, styles.addButton]}>
              <Text style={styles.addButtonText}>Add Item</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.H6,
    color: COLOR.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.body,
    color: COLOR.textPrimary,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLOR.stroke,
    borderRadius: 8,
    padding: 12,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.body,
    color: COLOR.textPrimary,
  },
  inputWithIcon: {
    position: "relative",
  },
  textInputWithIcon: {
    borderWidth: 1,
    borderColor: COLOR.stroke,
    borderRadius: 8,
    padding: 12,
    paddingRight: 40,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.body,
    color: COLOR.textPrimary,
  },
  inputIcon: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: COLOR.stroke,
  },
  cancelButtonText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.body,
    color: COLOR.textSecondary,
  },
  addButton: {
    backgroundColor: COLOR.primary,
  },
  addButtonText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.body,
    color: "white",
  },
});

export default AddItemModal;
