import type React from "react"
import { Text } from "react-native"
import MaskedView from "@react-native-masked-view/masked-view"
import { LinearGradient } from "expo-linear-gradient"

interface GradientTextProps {
  text: string
  colors: [string, string, ...string[]]
  start?: { x: number; y: number }
  end?: { x: number; y: number }
  style?: object
}

export const GradientText: React.FC<GradientTextProps> = ({
  text,
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
  style,
}) => {
  return (
    <MaskedView maskElement={<Text style={style}>{text}</Text>}>
      <LinearGradient colors={colors} start={start} end={end}>
        <Text style={[style, { opacity: 0 }]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  )
}

