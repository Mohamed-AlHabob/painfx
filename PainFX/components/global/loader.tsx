import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

type LoaderProps = {
  loading: boolean;
  children: React.ReactNode;
};

export const Loader: React.FC<LoaderProps> = ({ loading, children }) => {
  if (loading) {
    return <ActivityIndicator size="small" color="#0000ff" />;
  }
  return <Text>{children}</Text>;
};

