import React, { useState } from "react"
import { View, TextInput,Text, Button, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { Link, Redirect, useRouter } from "expo-router"
import { ENDPOINTS } from "@/services/config"
import api from "@/services/api"
import { setAuthTokens } from "@/services/auth"
import { useGlobalContext } from "@/providers/global-provider"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
const { refetch, loading, isLogged } = useGlobalContext();
if (!loading && isLogged) return <Redirect href="/" />;

  const handleLoginWithEmail = async () => {
    try {
      const response = await api.post(ENDPOINTS.LOGIN, {
        email,
        password,
      });

      if (response.data.access && response.data.refresh) {
        await setAuthTokens(response.data.access, response.data.refresh);
        refetch();
        Alert.alert("Success", "Login successful!");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Invalid email or password. Please try again.");
    }
  };

  return (
    <>
    <Text className="text-lg font-rubik text-black-200 text-center mt-12">
      Login with Email and Password
    </Text>

    <TextInput
      className="border border-gray-300 rounded-full w-full py-2 px-4 mt-5"
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
    />

    <TextInput
      className="border border-gray-300 rounded-full w-full py-2 px-4 mt-5"
      placeholder="Password"
      value={password}
      onChangeText={setPassword}
      secureTextEntry
      autoCapitalize="none"
    />

    <TouchableOpacity
      onPress={handleLoginWithEmail}
      className="bg-primary-300 rounded-full w-full py-4 mt-5"
    >
      <Text className="text-lg font-rubik-medium text-white text-center">
        Login
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      className="mt-5"
    >
      <Link href="/signup">
      <Text className="text-lg font-rubik text-primary-300 text-center">
        Don't have an account? Register
      </Text>
      </Link>
    </TouchableOpacity>
  </>
  )
}


