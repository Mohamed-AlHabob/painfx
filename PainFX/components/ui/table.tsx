import { useTheme } from "@/providers/theme-provider"
import React from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"

interface TableProps {
  headers: string[]
  data: any[][]
  glassEffect?: boolean
}

export const Table: React.FC<TableProps> = ({ headers, data, glassEffect = false }) => {
  const { theme } = useTheme()

  return (
    <ScrollView horizontal>
      <View>
        <View style={styles.headerRow}>
          {headers.map((header, index) => (
            <View
              key={index}
              style={[styles.headerCell, { backgroundColor: theme.colors.primary }, glassEffect && styles.glassEffect]}
            >
              <Text style={[styles.headerText, { color: theme.colors.background }]}>{header}</Text>
            </View>
          ))}
        </View>
        {data.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, cellIndex) => (
              <View
                key={cellIndex}
                style={[styles.cell, { backgroundColor: theme.colors.background }, glassEffect && styles.glassEffect]}
              >
                <Text style={[styles.cellText, { color: theme.colors.text }]}>{cell}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
  },
  headerCell: {
    padding: 10,
    minWidth: 100,
  },
  headerText: {
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    padding: 10,
    minWidth: 100,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cellText: {},
  glassEffect: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
  },
})

