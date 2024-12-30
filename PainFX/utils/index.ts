import { StyleSheet } from 'react-native';

export const cn = (...styles: any[]) => {
  return StyleSheet.flatten(styles.filter(Boolean));
};

