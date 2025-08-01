import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { COLOR, FONT_SIZE, FONTS } from "../../../constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import AddItemModal from "../../../components/itinerary/AddItemModal";
import { useItinerary } from "../../../utils/itinerary/UseItinerary";
import { formatTime } from "../../../utils/calendar/formatTime";
import Spinner from "../../../components/Spinner";
import ErrorScreen from "../../../components/ErrorScreen";
import EmptyItineraryPlaceholder from "../../../components/itinerary/EmptyItineraryPlaceholder";
import Entypo from "@expo/vector-icons/Entypo";

const ItineraryItem = ({ item, index, totalItems, isEditing, isDeleting }) => {
  const isLast = index === totalItems - 1;
  const isFirst = index === 0;

  return (
    <View style={styles.itemContainer}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(item.time)}</Text>
      </View>

      <View style={styles.timelineContainer}>
        <View
          style={[
            styles.timelineDot,
            isFirst ? styles.firstDot : styles.regularDot,
            item.isCompleted && styles.completedDot,
          ]}
        />
        {!isLast && <View style={styles.timelineLine} />}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.subtitleText}>{item.subtitle}</Text>
      </View>
      <View style={styles.actionContainer}>
        {isEditing && <Feather name="edit" size={20} color={COLOR.grey} />}
        {isDeleting && (
          <Ionicons name="remove-circle" size={24} color={COLOR.danger} />
        )}
      </View>
    </View>
  );
};

const ItineraryList = ({ route }) => {
  const itemListData = route.params;
  const tripId = itemListData.tripData.id || "";
  const dayName = itemListData.item.id;
  const { itinerary, loading, error } = useItinerary(tripId, dayName);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(true);

  if (loading) return <Spinner />;
  if (error) return <ErrorScreen />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centeringContainer}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>{itemListData.item.title}</Text>
              <TouchableOpacity style={styles.moreButton}>
                <Entypo
                  name="dots-three-vertical"
                  size={18}
                  color={COLOR.grey}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.dateContainer}>
              <Feather
                name="calendar"
                size={14}
                style={styles.calendarIcon}
                color={COLOR.placeholder}
              />
              <Text style={styles.dateText}> {itemListData.item.date}</Text>
            </View>
          </View>

          {/* Itinerary List */}
          {itinerary.length === 0 ? (
            <EmptyItineraryPlaceholder />
          ) : (
            <FlatList
              data={itinerary}
              renderItem={({ item, index }) => (
                <ItineraryItem
                  item={item}
                  index={index}
                  totalItems={itinerary.length}
                  isEditing={isEditing}
                  isDeleting={isDeleting}
                />
              )}
              keyExtractor={(item) => item.id}
              style={styles.flatList}
              contentContainerStyle={styles.flatListContent}
              showsVerticalScrollIndicator={false}
              maxToRenderPerBatch={10}
              windowSize={10}
            />
          )}
        </View>
      </View>
      {/* Floating Action Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
        style={styles.fab}
      >
        <Ionicons name="add" size={24} color={COLOR.actionText} />
      </TouchableOpacity>

      <AddItemModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        listData={itemListData}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centeringContainer: {
    flex: 1,
    marginTop: 20,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "white",
    paddingBottom: 20,
    borderRadius: 16,
    shadowColor: COLOR.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    maxWidth: 400,
    width: "100%",
    height: 600,
    flex: 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.H5,
    color: "#212529",
  },
  moreButton: {
    padding: 4,
  },
  moreDotsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  moreDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLOR.grey,
    marginHorizontal: 1,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: FONT_SIZE.body,
    color: "#6c757d",
  },
  flatList: {
    flex: 1,
    height: 0,
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  itemContainer: {
    flexDirection: "row",
    marginBottom: 24,
    alignItems: "flex-start",
  },
  timeContainer: {
    width: 80,
    paddingTop: 4,
  },

  timeText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.caption,
    color: "#6c757d",
  },
  timelineContainer: {
    alignItems: "center",
    marginHorizontal: 16,
    paddingTop: 4,
    position: "relative",
    width: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 2,
    position: "relative",
  },
  firstDot: {
    backgroundColor: COLOR.primary,
  },
  regularDot: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: COLOR.stroke,
  },
  completedDot: {
    backgroundColor: COLOR.primary,
    borderColor: COLOR.primary,
  },
  timelineLine: {
    width: 2,
    backgroundColor: COLOR.stroke,
    position: "absolute",
    top: 12,
    bottom: -24,
    left: 7,
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 2,
  },
  titleText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.bodyLarge,
    color: COLOR.textPrimary,
    marginBottom: 4,
  },
  subtitleText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.body,
    color: COLOR.grey,
    lineHeight: 20,
  },
  actionContainer: {
    paddingTop: 4,
    paddingRight: 8,
  },
  fab: {
    position: "absolute",
    bottom: 45,
    right: 25,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLOR.actionButton,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLOR.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default ItineraryList;
