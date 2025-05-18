
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

export default function StartSession({ children, onPress }: any) {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={onPress}>
      <View style={styles.button}>
        {children}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { 
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 40,
    height: 50,
    borderRadius: 35,
    backgroundColor: '#ff6347',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
});
