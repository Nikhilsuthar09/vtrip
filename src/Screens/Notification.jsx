import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFetchNotification } from "../utils/notification/useFetchNotifications";
import { formatTime } from "../utils/timestamp/formatAndGetTime";
import { useState } from "react";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import Spinner from "../components/Spinner";
import NotificationPlaceholder from "../components/notification/placeholder";
import { reqAcceptedBody, status } from "../constants/notification";
import { changeStatusInDb } from "../utils/tripData/room/addTravellerToRoom";
import { useAuth } from "../Context/AuthContext";
import { sendPushNotification } from "../utils/notification/sendNotification";
import { getPushToken } from "../utils/notification/getToken";

const NotificationsScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { notifications, loading, refetch } = useFetchNotification();
  const { uid, name } = useAuth();

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  console.log(notifications)

  const onRejectPress = async (notiId) => {
    const message = await changeStatusInDb(uid, notiId, status.REJECTED);
    if (message?.status === "Error") {
      Alert.alert(message.status, message.message);
      return;
    }
    await onRefresh();
  };
  const onAcceptPress = async (notiId, requesterUid) => {
    const message = await changeStatusInDb(uid, notiId, status.ACCEPTED);
    if (message?.status === "Error") {
      Alert.alert(message.status, message.message);
      return;
    }
    const requesterToken = await getPushToken(requesterUid);
    const notifiData = reqAcceptedBody(name)
    await sendPushNotification(requesterToken, notifiData);
    await onRefresh();
  };

  const renderNotificationCard = (notification) => (
    <View
      key={notification?.id}
      style={[styles.notificationCard, { backgroundColor: "#EDE9FE" }]}
    >
      <View style={styles.notificationHeader}>
        <View style={[styles.iconContainer, { backgroundColor: "#8B5CF6" }]}>
          <Ionicons name="airplane" size={20} color="white" />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.notificationTitle}>{notification?.title}</Text>
          <Text style={styles.notificationTime}>
            {formatTime(notification?.createdAt)}
          </Text>
        </View>
      </View>

      <Text style={styles.notificationDescription}>{notification?.body}</Text>
      {notification?.type === "join_request" &&
        (notification?.status === status.PENDING ? (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { borderColor: COLOR.danger }]}
              onPress={() => onRejectPress(notification?.id)}
            >
              <Text style={[styles.actionText, { color: COLOR.danger }]}>
                Reject
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                onAcceptPress(notification?.id, notification?.requesterUid)
              }
              style={[
                styles.actionButton,
                { borderColor: COLOR.success, backgroundColor: COLOR.success },
              ]}
            >
              <Text style={[styles.actionText, { color: "#fff" }]}>Accept</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text
            style={{ fontFamily: FONTS.regular, fontSize: FONT_SIZE.caption }}
          >
            Request {notification.status}
          </Text>
        ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* notificationsData List */}
      <ScrollView
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notifications.length === 0 ? (
          <NotificationPlaceholder />
        ) : loading ? (
          <Spinner />
        ) : (
          notifications.map(renderNotificationCard)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  notificationCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  notificationTitle: {
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: FONT_SIZE.caption,
    color: COLOR.grey,
    fontFamily: FONTS.semiBold,
  },
  notificationDescription: {
    fontSize: FONT_SIZE.body,
    color: COLOR.grey,
    lineHeight: 20,
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionText: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.medium,
  },
});

export default NotificationsScreen;
