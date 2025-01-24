import { useTheme } from "@/providers/theme-provider"
import { View, Text, StyleSheet, Image } from "react-native"


interface MapMarkerProps {
  count?: number
  image?: string
  size?: "small" | "medium" | "large"
}

export const MapMarker: React.FC<MapMarkerProps> = ({ count, image, size = "medium" }) => {
  const { theme } = useTheme()

  const markerSize = {
    small: 40,
    medium: 50,
    large: 60,
  }[size]

  if (count) {
    return (
      <View
        style={[
          styles.clusterContainer,
          {
            backgroundColor: theme.colors.primary,
            width: markerSize,
            height: markerSize,
            borderRadius: markerSize / 2,
          },
        ]}
      >
        <Text style={styles.clusterText}>{count}</Text>
      </View>
    )
  }

  return (
    <View
      style={[
        styles.markerContainer,
        {
          width: markerSize,
          height: markerSize,
          borderColor: theme.colors.primary,
        },
      ]}
    >
      <Image
        source={{ uri: image }}
        style={[
          styles.markerImage,
          {
            width: markerSize - 4,
            height: markerSize - 4,
            borderRadius: (markerSize - 4) / 2,
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  clusterContainer: {
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  clusterText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  markerContainer: {
    borderWidth: 2,
    borderRadius: 30,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  markerImage: {
    backgroundColor: "#fff",
  },
})

