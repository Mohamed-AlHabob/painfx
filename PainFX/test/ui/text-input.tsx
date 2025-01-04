import { TextInput as RNTextInput, TextInputProps } from 'react-native'
import { useAppContext } from '@/hooks/useAppContext';


interface CustomTextInputProps extends TextInputProps {
  className?: string
}

export function TextInput({ className = '', ...props }: CustomTextInputProps) {
  const { isDarkMode } = useAppContext();
  
  return (
    <RNTextInput
      className={`p-4 rounded-lg w-full mb-4 ${
        isDarkMode 
          ? 'bg-gray-800 text-white border-gray-700' 
          : 'bg-gray-100 text-black border-gray-200'
      } border ${className}`}
      placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
      {...props}
    />
  )
}

