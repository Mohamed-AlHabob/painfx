import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useAppContext } from '@/hooks/useAppContext';


interface ButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Button({ 
  onPress, 
  children, 
  variant = 'primary',
  loading = false,
  disabled = false,
  className = ''
}: ButtonProps) {
  const { isDarkMode } = useAppContext();

  const getVariantStyles = () => {
    switch(variant) {
      case 'primary':
        return `${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} ${disabled ? 'opacity-50' : ''}`;
      case 'secondary':
        return `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} ${disabled ? 'opacity-50' : ''}`;
      case 'outline':
        return `border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} ${disabled ? 'opacity-50' : ''}`;
      default:
        return '';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`p-3 rounded-full items-center justify-center flex-row ${getVariantStyles()} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? (isDarkMode ? '#fff' : '#000') : '#fff'} />
      ) : (
        <Text 
          className={`font-medium ${
            variant === 'outline' 
              ? (isDarkMode ? 'text-white' : 'text-black')
              : 'text-white'
          }`}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

