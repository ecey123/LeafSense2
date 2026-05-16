import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../constants/colors";

export default function TopHeader({ title, showBack, onBack }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.left}>{title}</Text>
        </View>
        <Text style={styles.right}>LeafSense 🌿</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 50,
    paddingHorizontal: 18,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  container: {
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 4,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButton: {
    paddingRight: 4,
  },
  backText: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: "bold",
  },
  left: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
  },
  right: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
  },
});