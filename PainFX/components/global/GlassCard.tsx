import { Slot } from 'expo-router';
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

const GlassCard = ({ children, style }: Props) => {
  return (
    <View style={[styles.card, style]}>
      <Slot />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: 'rgba(148, 163, 184, 0.4)',
    overflow: 'hidden',
  },
});

export default GlassCard;

