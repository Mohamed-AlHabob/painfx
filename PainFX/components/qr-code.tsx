import { View } from 'react-native'
import { useContext } from 'react'
import QRCode from 'react-native-qrcode-svg'
import { ThemeContext } from '@/constants/ThemeContext'

interface QRCodeProps {
  value: string
}

export function QRCodeC({ value }: QRCodeProps) {
  const { isDarkMode } = useContext(ThemeContext)

  return (
    <View 
      className={`p-4 rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } items-center`}
    >
      <QRCode
        value={`https://threads.net/@${value}`}
        size={200}
        color={isDarkMode ? '#ffffff' : '#000000'}
        backgroundColor={isDarkMode ? '#1f2937' : '#ffffff'}
      />
    </View>
  )
}

