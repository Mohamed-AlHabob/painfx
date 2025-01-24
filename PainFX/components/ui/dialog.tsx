import { useTheme } from "@/providers/theme-provider"
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native"

interface DialogProps {
  visible: boolean
  onClose: () => void
  title: string
  content: string
  glassEffect?: boolean
}

export const Dialog: React.FC<DialogProps> = ({ visible, onClose, title, content, glassEffect = false }) => {
  const { theme } = useTheme()

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View
          style={[styles.modalView, { backgroundColor: theme.colors.background }, glassEffect && styles.glassEffect]}
        >
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{title}</Text>
          <Text style={[styles.modalContent, { color: theme.colors.text }]}>{content}</Text>
          <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={onClose}>
            <Text style={[styles.buttonText, { color: theme.colors.background }]}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalContent: {
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  glassEffect: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
  },
})