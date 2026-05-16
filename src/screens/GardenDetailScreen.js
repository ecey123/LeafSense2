import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from "react-native";

import TopHeader from "../components/TopHeader";
import colors from "../constants/colors";

export default function GardenDetailScreen({ route }) {
  const { item } = route.params;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopHeader title="Scan Detail" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground source={{ uri: item.imageUri }} style={styles.hero}>
          <View style={styles.overlay} />

          <Text style={styles.title}>{item.diseaseName}</Text>
        </ImageBackground>

        <View style={styles.content}>
          <Text style={styles.category}>Scan Result</Text>

          <Text style={styles.readTime}>{item.date}</Text>

          <Text style={styles.sectionTitle}>Detected Disease</Text>
          <Text style={styles.description}>{item.diseaseName}</Text>

          {item.confidence && (
            <>
              <Text style={styles.sectionTitle}>Confidence</Text>
              <Text style={styles.description}>{item.confidence}</Text>
            </>
          )}

          {item.description && (
            <>
              <Text style={styles.sectionTitle}>About Result</Text>
              <Text style={styles.description}>{item.description}</Text>
            </>
          )}

          <Text style={styles.meta}>Saved from scan • {item.date}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 240,
    justifyContent: "flex-end",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  title: {
  color: "#fff",
  fontSize: 26,
  fontWeight: "bold",
  marginHorizontal: 16,
  marginBottom: 30,
},

  content: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20,
    padding: 16,
    paddingBottom: 120,
  },

  category: {
    color: "#3C8A4E",
    fontWeight: "700",
    fontSize: 13,
  },

  readTime: {
    marginTop: 6,
    color: "#8C9B8F",
    fontWeight: "600",
  },

  sectionTitle: {
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 16,
    color: colors.text,
  },

  description: {
    marginTop: 10,
    color: colors.text,
    lineHeight: 24,
  },

  meta: {
    marginTop: 8,
    color: "#8C9B8F",
    fontSize: 13,
    fontWeight: "600",
  },
});