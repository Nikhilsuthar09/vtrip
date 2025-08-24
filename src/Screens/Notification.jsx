import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFetchNotification } from "../utils/notification/useFetchNotifications";
import { formatTime } from "../utils/timestamp/formatAndGetTime";

const NotificationsScreen = () => {
  const { notifications, loading, refetch } = useFetchNotification();

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

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* notificationsData List */}
      <ScrollView
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map(renderNotificationCard)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "white",
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#3B82F6",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#64748B",
  },
  activeTabText: {
    color: "#1E293B",
    fontWeight: "600",
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
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  notificationDescription: {
    fontSize: 14,
    color: "#475569",
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
    backgroundColor: "transparent",
    borderColor: "#D1D5DB",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
});

export default NotificationsScreen;
