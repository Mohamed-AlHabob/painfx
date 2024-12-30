import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { showMessage } from 'react-native-flash-message';

import { CONSTANTS } from '@/constants';
import { useAppDispatch } from '@/redux/hooks';
import { useLoginMutation } from '@/redux/services/auth/authApiSlice';
import { setAuth } from '@/redux/services/auth/authSlice';
import { extractErrorMessage } from '@/utils/error-handling';
import GoogleAuthButton from '@/components/global/GoogleAuthButton';
import { Button } from '@/components/ui/button';
import FormInput from '@/components/ui/FormInput';


const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInFormData = z.infer<typeof SignInSchema>;

const SignInPage = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const { control, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
    resolver: zodResolver(SignInSchema),
    mode: 'onBlur',
  });

  const onAuthenticateUser = async (values: SignInFormData) => {
    try {
      const result = await login(values).unwrap();
      dispatch(setAuth());
      showMessage({
        message: "Logged in successfully!",
        type: "success",
      });
      navigation.navigate('index');
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      showMessage({
        message: errorMessage,
        type: "danger",
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>
        Protect yourself from misinformation with advanced video verification.
      </Text>
      <View style={styles.form}>
        {CONSTANTS.signInForm.map((field) => (
          <Controller
            key={field.name}
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label={field.label}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors[field.name]?.message}
                secureTextEntry={field.type === 'password'}
                keyboardType={field.type === 'email' ? 'email-address' : 'default'}
                autoCapitalize="none"
              />
            )}
            name={field.name as keyof SignInFormData}
          />
        ))}
        <TouchableOpacity onPress={() => navigation.navigate('PasswordReset')}>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>
        <Button
          title="Sign In with Email"
          onPress={handleSubmit(onAuthenticateUser)}
          disabled={isLoading}
          loading={isLoading}
        />
      </View>
      <View style={styles.separatorContainer}>
        <View style={styles.separator} />
        <Text style={styles.separatorText}>OR CONTINUE WITH</Text>
        <View style={styles.separator} />
      </View>
      <GoogleAuthButton />
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.registerLink}>Register here</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  form: {
    marginBottom: 20,
  },
  forgotPassword: {
    color: '#4F46E5',
    textAlign: 'right',
    marginBottom: 20,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 12,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 14,
    color: '#666',
  },
  registerLink: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: 'bold',
  },
});

export default SignInPage;

