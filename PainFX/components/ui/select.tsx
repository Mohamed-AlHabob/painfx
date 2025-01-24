import { useTheme } from '@/providers/theme-provider';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';



interface SelectOption {
  label: string
  value: string
}

interface SelectProps {
  options: SelectOption[]
  selectedValue: string
  onValueChange: (value: string) => void
  placeholder?: string
  glassEffect?: boolean
}

export const Select: React.FC<SelectProps> = ({
  options,
  selectedValue,
  onValueChange,
  placeholder = "Select an option",
  glassEffect = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const { theme } = useTheme()

  const selectedOption = options.find((option) => option.value === selectedValue)

  return (
    <View>
      <TouchableOpacity
        style={[styles.selectButton, { borderColor: theme.colors.border }, glassEffect && styles.glassEffect]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: theme.colors.text }}>{selectedOption ? selectedOption.label : placeholder}</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.optionItem}
                onPress={() => {
                  onValueChange(option.value)
                  setModalVisible(false)
                }}
              >
                <Text style={{ color: theme.colors.text }}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  selectButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  optionItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  glassEffect: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
  },
})

