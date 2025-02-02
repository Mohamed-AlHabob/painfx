import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Linking,
  TextInput,
} from "react-native";
import { Link, Redirect } from "expo-router";
import icons from "@/constants/icons";
import images from "@/constants/images";
import continueWithSocialAuth from "@/services/socialAuth";
import { useGlobalContext } from "@/providers/global-provider";


const Auth = () => {
  const { refetch, loading, isLogged } = useGlobalContext();
  if (!loading && isLogged) return <Redirect href="/" />;

  const handleLoginWithGoogle = async () => {
    try {
      const authUrl = await continueWithSocialAuth("google", "auth");
      await Linking.openURL(authUrl);
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Failed to login. Please try again.");
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <Image
          source={images.onboarding}
          className="w-full h-4/6"
          resizeMode="contain"
        />

        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Welcome To Real Scout
          </Text>

          <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
            Let's Get You Closer To {"\n"}
            <Text className="text-primary-300">Your Ideal Home</Text>
          </Text>
            <>
              <Text className="text-lg font-rubik text-black-200 text-center mt-12">
                Login to Real Scout
              </Text>

              <TouchableOpacity
                onPress={handleLoginWithGoogle}
                className="bg-white shadow-md shadow-zinc-300 rounded-full w-full py-4 mt-5"
              >
                <View className="flex flex-row items-center justify-center">
                  <Image
                    source={icons.google}
                    className="w-5 h-5"
                    resizeMode="contain"
                  />
                  <Text className="text-lg font-rubik-medium text-black-300 ml-2">
                    Continue with Google
                  </Text>
                </View>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Auth;
