import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { CameraView, Camera } from "expo-camera";

import TopHeader from "../components/TopHeader";
import colors from "../constants/colors";
import { saveGardenItem } from "../utils/gardenStorage";

const API_URL = "http://192.168.1.4:8000/predict";

export default function ScanScreen() {
  const cameraRef = useRef(null);

  const [cameraPermission, setCameraPermission] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    askCameraPermission();
  }, []);

  const askCameraPermission = async () => {
    const permission = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(permission.status === "granted");
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      quality: 1,
    });

    setImageUri(photo.uri);
    setResult(null);
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission needed", "Please allow gallery access.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });

    if (pickerResult.canceled) return;

    setImageUri(pickerResult.assets[0].uri);
    setResult(null);
  };

  const sendImageToBackend = async () => {
    if (!imageUri) {
      Alert.alert("Warning", "Please take or select a photo first.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("file", {
        uri: imageUri,
        name: "leaf.jpg",
        type: "image/jpeg",
      });

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Backend error", data.detail || "Prediction failed.");
        return;
      }

      setResult(data);

      await saveGardenItem({
        imageUri: imageUri,
        diseaseName: data.disease_prediction,
        confidence: (data.disease_confidence * 100).toFixed(1) + "%",
        description: "Detected from scan",
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Connection error", "Backend'e ulaşılamadı.");
    } finally {
      setLoading(false);
    }
  };

  const clearPhoto = () => {
    setImageUri(null);
    setResult(null);
  };

  if (cameraPermission === null) {
    return (
      <View style={styles.screen}>
        <TopHeader title="Scan" />
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Opening camera...</Text>
        </View>
      </View>
    );
  }

  if (cameraPermission === false) {
    return (
      <View style={styles.screen}>
        <TopHeader title="Scan" />
        <View style={styles.loadingBox}>
          <Text style={styles.permissionTitle}>Camera permission is closed</Text>
          <Text style={styles.permissionText}>
            Please allow camera access from your phone settings.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <TopHeader title="Scan" />

      <View style={styles.cameraContainer}>
        {!imageUri ? (
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            mode="picture"
            zoom={0.05}
          />
        ) : (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        )}

        <View style={styles.controls}>
          <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
            <Text style={styles.galleryText}>⊞</Text>
          </TouchableOpacity>

          {!imageUri ? (
            <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.scanButton}
              onPress={sendImageToBackend}
              disabled={loading}
            >
              <Text style={styles.scanButtonText}>
                {loading ? "Scanning..." : "Scan Leaf"}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.clearButton} onPress={clearPhoto}>
            <Text style={styles.clearText}>×</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 16 }}
        />
      )}

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Result</Text>

          <Text style={styles.resultText}>
            Plant: {result.crop_prediction}
          </Text>

          <Text style={styles.resultText}>
            Plant Confidence: {(result.crop_confidence * 100).toFixed(1)}%
          </Text>

          <Text style={styles.resultText}>
            Disease: {result.disease_prediction}
          </Text>

          <Text style={styles.resultText}>
            Disease Confidence: {(result.disease_confidence * 100).toFixed(1)}%
          </Text>

          <TouchableOpacity
            style={styles.scanAnotherButton}
            onPress={clearPhoto}
          >
            <Text style={styles.scanAnotherText}>Scan Another</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  cameraContainer: {
    flex: 1,
    margin: 18,
    marginBottom: 110,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "#000",
  },

  camera: {
    flex: 1,
  },

  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  controls: {
    position: "absolute",
    bottom: 28,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  captureButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },

  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: colors.primary,
  },

  galleryButton: {
    position: "absolute",
    left: 28,
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },

  galleryText: {
    fontSize: 24,
    color: colors.text,
  },

  clearButton: {
    position: "absolute",
    right: 28,
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },

  clearText: {
    fontSize: 30,
    color: colors.text,
    marginTop: -2,
  },

  scanButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 42,
    paddingVertical: 16,
    borderRadius: 24,
  },

  scanButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  resultBox: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 110,
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#fff",
  },

  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.primary,
  },

  resultText: {
    color: colors.text,
    marginBottom: 4,
  },

  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  loadingText: {
    marginTop: 12,
    color: colors.muted,
  },

  permissionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
  },

  permissionText: {
    color: colors.muted,
    textAlign: "center",
    marginTop: 8,
  },

  scanAnotherButton: {
    backgroundColor: colors.primary,
    padding: 13,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 14,
  },

  scanAnotherText: {
    color: "#fff",
    fontWeight: "bold",
  },
});