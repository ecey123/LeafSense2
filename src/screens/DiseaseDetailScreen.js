import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from "react-native";

import TopHeader from "../components/TopHeader";
import colors from "../constants/colors";

export default function DiseaseDetailScreen({ route, navigation }) {
  const { disease } = route.params;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopHeader title={disease.name} showBack onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground source={disease.images[0]} style={styles.hero}>
          <View style={styles.overlay} />
          <Text style={styles.title}>{disease.name}</Text>
        </ImageBackground>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>About Disease</Text>
          <Text style={styles.description}>{disease.description}</Text>

          <Text style={styles.sectionTitle}>Symptoms</Text>
          <Text style={styles.description}>{disease.symptoms}</Text>

          <Text style={styles.sectionTitle}>Treatment</Text>
          <Text style={styles.description}>{disease.treatment}</Text>
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
    margin: 16,
  },

  content: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20,
    padding: 16,
    paddingBottom: 120,
  },

  sectionTitle: {
    marginTop: 16,
    fontWeight: "bold",
    fontSize: 16,
    color: colors.text,
  },

  description: {
    marginTop: 10,
    color: colors.text,
    lineHeight: 22,
  },
});