import { View, Text, StyleSheet } from "react-native";
import colors from "../constants/colors";

export default function TopHeader({ title }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.left}>{title}</Text>
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