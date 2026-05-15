import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import TopHeader from "../components/TopHeader";
import colors from "../constants/colors";
import { blogs } from "../data/blogsData";

const categories = ["All", "Psychology", "AI", "Nature"];

export default function BlogScreen() {
  const navigation = useNavigation();

  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredBlogs =
    selectedCategory === "All"
      ? blogs
      : blogs.filter((item) => item.category === selectedCategory);

  const featuredBlog = blogs[0];

  const renderBlogCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() =>
         navigation.navigate("BlogDetail", {
  blog: item,
})
        }
      >
        <Image source={item.image} style={styles.cardImage} />

        <View style={styles.cardContent}>
          <Text style={styles.category}>{item.category}</Text>

          <Text style={styles.title}>{item.title}</Text>

          <Text style={styles.summary}>{item.summary}</Text>

          <Text style={styles.readTime}>{item.readTime}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TopHeader title="Blog" />

      <FlatList
        data={filteredBlogs}
        keyExtractor={(item) => item.id}
        renderItem={renderBlogCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <TouchableOpacity
              style={styles.heroCard}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate("BlogDetail", {
                  blog: featuredBlog,
                })
              }
            >
              <Image
                source={featuredBlog.image}
                style={styles.heroImage}
              />

              <View style={styles.overlay}>
                <Text style={styles.heroTag}>Featured Article</Text>

                <Text style={styles.heroTitle}>
                  {featuredBlog.title}
                </Text>

                <Text style={styles.heroText}>
                  {featuredBlog.summary}
                </Text>
              </View>
            </TouchableOpacity>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categories}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  style={[
                    styles.chip,
                    selectedCategory === category && styles.activeChip,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedCategory === category &&
                        styles.activeChipText,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>
              Latest Articles
            </Text>
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 35,
  },

  heroCard: {
    height: 220,
    borderRadius: 28,
    overflow: "hidden",
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#DDEEDD",
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 18,
    backgroundColor: "rgba(0,0,0,0.38)",
  },

  heroTag: {
    color: "#DDF5E3",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },

  heroTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },

  heroText: {
    color: "#F0FFF2",
    fontSize: 13,
    lineHeight: 18,
  },

  categories: {
    marginBottom: 20,
  },

  chip: {
    backgroundColor: "#E5F2E7",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },

  activeChip: {
    backgroundColor: "#2E6B3F",
  },

  chipText: {
    color: "#45624D",
    fontWeight: "600",
    fontSize: 13,
  },

  activeChipText: {
    color: "white",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F3D2B",
    marginBottom: 14,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 24,
    padding: 12,
    marginBottom: 16,
    elevation: 3,
  },

  cardImage: {
    width: 105,
    height: 120,
    borderRadius: 18,
  },

  cardContent: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },

  category: {
    color: "#3C8A4E",
    fontWeight: "700",
    marginBottom: 6,
    fontSize: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#203B28",
    marginBottom: 6,
  },

  summary: {
    color: "#6D7C70",
    lineHeight: 18,
    fontSize: 13,
  },

  readTime: {
    color: "#9AA89D",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
  },
});