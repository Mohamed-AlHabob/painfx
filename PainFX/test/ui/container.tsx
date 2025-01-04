import { View } from 'react-native'
import { useContext } from 'react'
import { LanguageContext } from '@/constants/LanguageContext'


interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export function Container({ children, className = '' }: ContainerProps) {
  const { isRTL } = useContext(LanguageContext)
  
  return (
    <View 
      className={`flex-1 ${isRTL ? 'items-end' : 'items-start'} ${className}`}
      style={{
        direction: isRTL ? 'rtl' : 'ltr'
      }}
    >
      {children}
    </View>
  )
}

