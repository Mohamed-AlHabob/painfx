import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Slot } from 'expo-router';
type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
};

const BackdropGradient = ({ children, style, containerStyle }: Props) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.gradient, style]} />
      <Slot />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    flexDirection: 'column',
  },
  gradient: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.4,
    marginHorizontal: 10,
  },
});

export default BackdropGradient;

