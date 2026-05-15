import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import TopHeader from "../components/TopHeader";
import colors from "../constants/colors";
import { getGardenItems, deleteGardenItem } from "../utils/gardenStorage";

export default function MyGardenScreen({ navigation }) {
  const [items, setItems] = useState([]);

  const loadGarden = async () => {
    const data = await getGardenItems();
    setItems(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadGarden();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert("Delete Scan", "Do you want to delete this scan?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteGardenItem(id);
          loadGarden();
        },
      },
    ]);
  };

  const openDetail = (item) => {
    navigation.navigate("GardenDetail", { item });
  };

  return (
    <View style={styles.container}>
      <TopHeader title="My Garden" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {items.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No scans yet</Text>
            <Text style={styles.emptyText}>
              Scanned plants will appear here.
            </Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.card}>
              <TouchableOpacity
                style={styles.cardContent}
                activeOpacity={0.8}
                onPress={() => openDetail(item)}
              >
                <Image source={{ uri: item.imageUri }} style={styles.image} />

                <View style={styles.info}>
                  <Text style={styles.name}>{item.diseaseName}</Text>
                  <Text style={styles.date}>{item.date}</Text>

                  {item.confidence && (
                    <Text style={styles.confidence}>
                      Confidence: {item.confidence}
                    </Text>
                  )}

                  <Text style={styles.tapText}>Tap to view details</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                activeOpacity={0.7}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.deleteText}>×</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 18,
    paddingBottom: 100,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 16,
    position: "relative",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingRight: 42,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 16,
    backgroundColor: "#eee",
  },

  info: {
    flex: 1,
    marginLeft: 14,
  },

  name: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },

  date: {
    fontSize: 13,
    color: "#777",
    marginTop: 6,
  },

  confidence: {
    fontSize: 13,
    color: colors.primary,
    marginTop: 4,
  },

  tapText: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },

  deleteButton: {
    position: "absolute",
    top: 8,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    elevation: 10,
  },

  deleteText: {
    fontSize: 23,
    color: "#777",
    marginTop: -2,
  },

  emptyBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    marginTop: 30,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },

  emptyText: {
    fontSize: 14,
    color: "#777",
    marginTop: 8,
    textAlign: "center",
  },
});