import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Slot } from 'expo-router';
import BackdropGradient from '@/components/global/BackdropGradient';
import GlassCard from '@/components/global/GlassCard';
type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
          <Text style={styles.title}>PainFX.</Text>
        <BackdropGradient style={styles.backdrop} containerStyle={styles.backdropContainer}>
          <GlassCard style={styles.card}>
            <Slot />
          </GlassCard>
        </BackdropGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  backdrop: {
    width: '33%',
    height: '33%',
    opacity: 0.4,
  },
  backdropContainer: {
    alignItems: 'center',
  },
  card: {
    width: '80%',
    padding: 28,
    marginTop: 64,
  },
});

export default AuthLayout;

