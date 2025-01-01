import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { SocialButton } from '@/components/ui/social-button';
import { Container } from '@/components/ui/container';
import { TextInput } from '@/components/ui/text-input';


export default function Login() {
  return (
    <Container className="flex-1 bg-[#0A0A0A]">
      <View className="flex-1 justify-center p-4 w-full max-w-sm mx-auto">
        <View className="items-center mb-8">
          <Text className="text-white text-3xl font-bold">PainFX.</Text>
        </View>

        <View className="mb-8">
          <Text className="text-white text-2xl font-semibold mb-2">
            Login
          </Text>
          <Text className="text-gray-400 text-base">
            Protect yourself from misinformation with advanced video verification.
          </Text>
        </View>

        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          className="bg-[#141414] border-transparent mb-3"
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          className="bg-[#141414] border-transparent mb-2"
        />

        <Link href="/forgot-password" className="mb-4">
          <Text className="text-gray-400 text-sm">
            Forgot password?
          </Text>
        </Link>

        <Button 
          onPress={() => {}} 
          className="bg-white mb-6"
        >
          <Text className="text-black font-semibold">Sign In with Email</Text>
        </Button>

        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-[1px] bg-gray-800" />
          <Text className="text-gray-500 mx-4 text-sm">OR CONTINUE WITH</Text>
          <View className="flex-1 h-[1px] bg-gray-800" />
        </View>

        <SocialButton
          icon="google"
          onPress={() => {}}
          className="mb-6"
        >
          Google
        </SocialButton>

        <View className="flex-row justify-center">
          <Text className="text-gray-400">
            Don't have an account?{' '}
          </Text>
          <Link href="/register" className="text-[#5B68F6]">
            Register here
          </Link>
        </View>
      </View>
    </Container>
  );
}

