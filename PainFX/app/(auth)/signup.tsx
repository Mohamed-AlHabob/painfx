import React, { useState } from "react"
import {TextInput,Text, TouchableOpacity, Alert } from "react-native"
import { Link } from "expo-router"
import api from "@/services/api"
import { ENDPOINTS } from "@/services/config"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = async () => {
    try {
      const response = await api.post(ENDPOINTS.REGISTER, {
        email,
        password,
      });
      if (response.data) {
        Alert.alert("Success", "Registration successful! Please login.");

      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", "Failed to register. Please try again.");
    }
  };

  return (
    <>
    <Text className="text-lg font-rubik text-black-200 text-center mt-12">
      Register with Email and Password
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
      onPress={handleRegister}
      className="bg-primary-300 rounded-full w-full py-4 mt-5"
    >
      <Text className="text-lg font-rubik-medium text-white text-center">
        Register
      </Text>
    </TouchableOpacity>

   <TouchableOpacity
     className="bg-primary-300 rounded-full w-full py-4 mt-5"
   >
     <Link href="/login">
     <Text className="text-lg font-rubik-medium text-white text-center">
       Login with Email
     </Text>
     </Link>
   </TouchableOpacity>
  </>

  )
}


