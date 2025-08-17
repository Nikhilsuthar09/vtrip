import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FONTS } from '../../constants/Theme';

const NotificationIcon = ({ badgeCount = 0, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.notificationContainer}>
      <MaterialIcons name="notifications" size={24} color="black" />
      {badgeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {badgeCount > 99 ? '99+' : badgeCount.toString()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    position: 'relative',
    padding: 4, 
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF4444', 
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: FONTS.semiBold,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 12,
  },
});

export default NotificationIcon;