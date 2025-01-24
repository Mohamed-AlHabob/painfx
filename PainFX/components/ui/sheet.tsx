import { useTheme } from '@/providers/theme-provider';
import React, { useCallback, useEffect, useImperativeHandle } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';


interface SheetProps {
  children: React.ReactNode
  glassEffect?: boolean
}

export const Sheet = React.forwardRef<{ snapTo: (index: number) => void }, SheetProps>(
  ({ children, glassEffect = false }, ref) => {
    const { theme } = useTheme()
    const translateY = useSharedValue(0)
    const active = useSharedValue(false)

    const scrollTo = useCallback((destination: number) => {
      "worklet"
      active.value = destination !== 0

      translateY.value = withSpring(destination, { damping: 50 })
    }, [])

    const isActive = useCallback(() => {
      return active.value
    }, [])

    useEffect(() => {
      scrollTo(0)
    }, [])

    useImperativeHandle(ref, () => ({ snapTo: scrollTo }), [scrollTo])

    const context = useSharedValue({ y: 0 })
    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: translateY.value }
      })
      .onUpdate((event) => {
        translateY.value = event.translationY + context.value.y
        translateY.value = Math.max(translateY.value, -300)
      })
      .onEnd(() => {
        if (translateY.value > -150) {
          scrollTo(0)
        } else if (translateY.value < -150) {
          scrollTo(-300)
        }
      })

    const rBottomSheetStyle = useAnimatedStyle(() => {
      const borderRadius = interpolate(translateY.value, [-300, 0], [25, 0], Extrapolate.CLAMP)

      return {
        borderRadius,
        transform: [{ translateY: translateY.value }],
      }
    })

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.bottomSheetContainer,
            rBottomSheetStyle,
            { backgroundColor: theme.colors.background },
            glassEffect && styles.glassEffect,
          ]}
        >
          <View style={styles.line} />
          {children}
        </Animated.View>
      </GestureDetector>
    )
  },
)


const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: 300,
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    top: 700,
    borderRadius: 25,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: "grey",
    alignSelf: "center",
    marginVertical: 15,
    borderRadius: 2,
  },
  glassEffect: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
  },
})

