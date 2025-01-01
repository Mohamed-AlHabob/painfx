import { TouchableOpacity, Text, View } from 'react-native';
import { Image } from 'react-native';

interface SocialButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  icon: 'google';
  className?: string;
}

export function SocialButton({ 
  onPress, 
  children, 
  icon,
  className = ''
}: SocialButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-center p-3 rounded-md bg-[#141414] ${className}`}
    >
      <View className="mr-2">
        {icon === 'google' && (
          <Image 
            source={{ uri: 'https://www.google.com/favicon.ico' }}
            className="w-5 h-5"
          />
        )}
      </View>
      <Text className="text-white font-medium">{children}</Text>
    </TouchableOpacity>
  );
}

