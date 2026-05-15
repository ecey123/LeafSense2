import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";

import TopHeader from "../components/TopHeader";
import colors from "../constants/colors";
import plants from "../data/plantsData";

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState("");

  const filteredPlants = plants.filter((plant) => {
    const plantName = plant.name.toLowerCase();
    const diseaseNames = plant.diseases
      .map((disease) => disease.name.toLowerCase())
      .join(" ");

    return (
      plantName.includes(search.toLowerCase()) ||
      diseaseNames.includes(search.toLowerCase())
    );
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopHeader title="Explore" />

      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          placeholder="Search plants or diseases..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholderTextColor={colors.muted}
        />

        {filteredPlants.map((plant) => (
          <TouchableOpacity
            key={plant.id}
            onPress={() =>
              navigation.navigate("PlantDetail", { plant: plant })
            }
            style={styles.card}
          >
            <Image source={plant.image} style={styles.image} />
            <View style={styles.overlay} />

            <Text style={styles.name}>{plant.name}</Text>

            <Text style={styles.diseaseCount}>
              {plant.diseases.length} diseases
            </Text>
          </TouchableOpacity>
        ))}

        {filteredPlants.length === 0 && (
          <Text style={styles.emptyText}>No results found</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 120,
  },

  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 18,
    fontSize: 15,
    color: colors.text,
  },

  card: {
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  name: {
    position: "absolute",
    bottom: 34,
    left: 15,
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  diseaseCount: {
    position: "absolute",
    bottom: 12,
    left: 16,
    color: "#fff",
    fontSize: 13,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: colors.muted,
  },
});