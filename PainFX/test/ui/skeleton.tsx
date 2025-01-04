import React from 'react';
import { DimensionValue, View, ViewProps } from 'react-native';
import { useAppContext } from '@/hooks/useAppContext';

import { StyleSheet as RNStyleSheet } from 'react-native';

interface SkeletonProps extends ViewProps {
  width?: number | string;
  height?: number | string;
  radius?: number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  width = '100%',
  height = 20,
  radius = 4,
  animation = 'pulse',
  style,
  ...props
}: SkeletonProps) {
  const { isDarkMode } = useAppContext();

  const baseColor = isDarkMode ? '#333' : '#E0E0E0';
  const highlightColor = isDarkMode ? '#444' : '#F5F5F5';

  const animationKeyframes = animation === 'pulse' ? [
    { opacity: 0.6 },
    { opacity: 0.8 },
    { opacity: 0.6 },
  ] : animation === 'wave' ? [
    { transform: [{ translateX: '-100%' }] },
    { transform: [{ translateX: '100%' }] },
  ] : [];

  return (
    <View
      style={[
        {
          width: width as DimensionValue,
          height: height as DimensionValue,
          borderRadius: radius,
          backgroundColor: baseColor,
          overflow: 'hidden',
        },
        style,
      ]}
      {...props}
    >
      {animation !== 'none' && (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: highlightColor },
          ]}
          className={`animate-${animation}`}
        />
      )}
    </View>
  );
}

const StyleSheet = RNStyleSheet.create({
  absoluteFillObject: {
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

