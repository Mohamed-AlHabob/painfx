import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Link, router } from 'expo-router';

import { colors, fontSizes, spacing, borderRadius } from '../../config/theme';
import { AppDispatch, RootState } from '@/redux/store';


export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  // const handleRegister = async () => {
  //   const result = await dispatch(registerUser({ email, password, name }));
  //   if (registerUser.fulfilled.match(result)) {
  //     router.replace('/');
  //   }
  // };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: '/linkedin-logo.png' }}
        style={styles.logo}
      />
      <Text style={styles.title}>Join LinkedIn</Text>
      <Text style={styles.subtitle}>Make the most of your professional life</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Full name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password (6+ characters)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {/* {error && <Text style={styles.error}>{error}</Text>} */}
      
      {/* <TouchableOpacity 
        style={styles.button}
        onPress={handleRegister}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Creating account...' : 'Agree & Join'}
        </Text>
      </TouchableOpacity> */}
      
      <Link href="/login" asChild>
        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>
            Already on LinkedIn? Sign in
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.large,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 84,
    height: 21,
    marginBottom: spacing.xlarge,
  },
  title: {
    fontSize: fontSizes.xxlarge,
    fontWeight: '600',
    marginBottom: spacing.small,
  },
  subtitle: {
    fontSize: fontSizes.large,
    color: colors.text.secondary,
    marginBottom: spacing.xlarge,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.small,
    paddingHorizontal: spacing.medium,
    marginBottom: spacing.large,
    fontSize: fontSizes.large,
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.small,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSizes.large,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: spacing.large,
  },
  linkText: {
    color: colors.primary,
    fontSize: fontSizes.large,
    fontWeight: '600',
  },
  error: {
    // color: colors.error,
    marginBottom: spacing.large,
  },
});

