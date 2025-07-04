import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { COLOR } from '../constants/Theme';

const CreateTripButton = ({ children, onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.innerButton}>
          {children}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  button: {
    top: -25, // Elevate above the tab bar
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: COLOR.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: '#ffffff',
  },
  innerButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreateTripButton;