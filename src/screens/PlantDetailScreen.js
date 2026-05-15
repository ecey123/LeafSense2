import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";

import TopHeader from "../components/TopHeader";
import colors from "../constants/colors";
import ImageViewer from "react-native-image-zoom-viewer";

export default function PlantDetailScreen({ route, navigation }) {
  const { plant } = route.params;
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopHeader title={plant.name} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HERO IMAGE */}
        <ImageBackground source={plant.image} style={styles.hero}>
          <View style={styles.overlay} />

          <Text style={styles.title}>{plant.name}</Text>
        </ImageBackground>

        {/* CONTENT */}
        <View style={styles.content}>
          {/* INFO CARDS */}
          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Planting</Text>
              <Text style={styles.infoValue}>
                {plant.info.planting}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Water</Text>
              <Text style={styles.infoValue}>
                {plant.info.watering}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Height</Text>
              <Text style={styles.infoValue}>
                {plant.info.height}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Sunlight</Text>
              <Text style={styles.infoValue}>
                {plant.info.sunlight}
              </Text>
            </View>
          </View>

          {/* GALLERY */}
          <Text style={styles.sectionTitle}>Gallery</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {plant.gallery.map((img, index) => (
           <TouchableOpacity key={index} onPress={() => setSelectedImage(img)}>
           <Image source={img} style={styles.galleryImg} />
           </TouchableOpacity>
           ))}
          </ScrollView>

          {/* DESCRIPTION */}
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{plant.description}</Text>

          {/* DISEASES */}
          <Text style={styles.sectionTitle}>Common Diseases</Text>

          {plant.diseases.map((d) => (
  <TouchableOpacity
    key={d.id}
    style={styles.diseaseCard}
    onPress={() =>
      navigation.navigate("DiseaseDetail", { disease: d })
    }
  >
    <Image source={d.images[0]} style={styles.diseaseImage} />

    <View style={{ marginLeft: 10 }}>
      <Text style={{ fontWeight: "bold" }}>{d.name}</Text>
      <Text style={{ color: colors.muted }}>
        Tap to see details
      </Text>
    </View>
  </TouchableOpacity>
))}
        </View>
      </ScrollView>
      <Modal visible={!!selectedImage} transparent={true}>
  <ImageViewer
    imageUrls={
      selectedImage
        ? [{ url: "", props: { source: selectedImage } }]
        : []
    }
    enableSwipeDown
    onSwipeDown={() => setSelectedImage(null)}
    onCancel={() => setSelectedImage(null)}
    backgroundColor="black"
  />
</Modal>
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
    backgroundColor: "rgba(0,0,0,0.3)",
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
  paddingBottom: 130,
},

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  infoCard: {
    width: "48%",
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  infoLabel: {
    color: colors.muted,
    fontSize: 12,
  },

  infoValue: {
    fontWeight: "bold",
    marginTop: 4,
  },

  sectionTitle: {
    marginTop: 16,
    fontWeight: "bold",
    fontSize: 16,
  },

  galleryImg: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 10,
    marginTop: 10,
  },

  description: {
    marginTop: 10,
    color: colors.text,
  },

  diseaseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
  },

  diseaseImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.85)",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
},
modalImage: {
  width: "100%",
  height: "80%",
  borderRadius: 16,
},
});