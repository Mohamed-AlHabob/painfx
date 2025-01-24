import { useTheme } from '@/providers/theme-provider';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from "react-native";


interface CardProps {
  title?: string; 
  content?: string;
  onPress?: () => void;
  glassEffect?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode; 
}

export const Card: React.FC<CardProps> = ({
  title,
  content,
  onPress,
  glassEffect = false,
  style,
  children,
}) => {
  const { theme } = useTheme();

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent
      style={[
        styles.card,
        { backgroundColor: glassEffect ? "rgba(255, 255, 255, 0.2)" : theme.colors.background },
        style,
      ]}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={title || "Card"}
    >
      {title && <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>}
      {content && <Text style={[styles.content, { color: theme.colors.text }]}>{content}</Text>}
      {children}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
  },
  glassEffect: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
  },
})