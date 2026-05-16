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

export default function BlogDetailScreen({ route, navigation }) {
  const { blog } = route.params;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopHeader title="Article" showBack onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground source={blog.image} style={styles.hero}>
          <View style={styles.overlay} />
          <Text style={styles.title}>{blog.title}</Text>
        </ImageBackground>

        <View style={styles.content}>
          <Text style={styles.category}>{blog.category}</Text>
          <Text style={styles.readTime}>{blog.readTime}</Text>

          <Text style={styles.sectionTitle}>About Article</Text>
          <Text style={styles.description}>{blog.content}</Text>

          <Text style={styles.meta}>
            {blog.author} • {blog.date}
          </Text>
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