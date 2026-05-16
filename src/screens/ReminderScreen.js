import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  Keyboard,
  Platform,
  Modal,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

import TopHeader from "../components/TopHeader";
import colors from "../constants/colors";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function ReminderScreen() {
  const [plants, setPlants] = useState([]);
  const [selectedPlantId, setSelectedPlantId] = useState(null);
  const [newPlantName, setNewPlantName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [hour, setHour] = useState("16");
  const [minute, setMinute] = useState("00");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("reminderPlants", JSON.stringify(plants));
  }, [plants]);

  const loadData = async () => {
    const savedPlants = await AsyncStorage.getItem("reminderPlants");

    if (savedPlants) {
      const parsedPlants = JSON.parse(savedPlants);
      setPlants(parsedPlants);

      if (parsedPlants.length > 0) {
        setSelectedPlantId(parsedPlants[0].id);
      }
    }
  };

  const selectedPlant = plants.find((p) => p.id === selectedPlantId);

  const addPlant = () => {
    if (newPlantName.trim() === "") {
      Alert.alert("Warning", "Please enter a plant name.");
      return;
    }

    const newPlant = {
      id: Date.now().toString(),
      name: newPlantName,
      records: [],
      reminders: [],
    };

    setPlants([newPlant, ...plants]);
    setSelectedPlantId(newPlant.id);
    setNewPlantName("");
    setModalVisible(false);
    Keyboard.dismiss();
  };

  const deletePlant = (plantId) => {
    Alert.alert("Delete Plant", "Are you sure you want to delete this plant?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const updated = plants.filter((p) => p.id !== plantId);
          setPlants(updated);
          if (selectedPlantId === plantId) {
            setSelectedPlantId(updated.length > 0 ? updated[0].id : null);
          }
        },
      },
    ]);
  };

  const addWateringRecord = () => {
    if (!selectedPlant) {
      Alert.alert("Warning", "Please add a plant first.");
      return;
    }

    const newRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    const updatedPlants = plants.map((plant) =>
      plant.id === selectedPlant.id
        ? { ...plant, records: [newRecord, ...plant.records] }
        : plant
    );

    setPlants(updatedPlants);
  };

  const deleteRecord = (recordId) => {
    const updatedPlants = plants.map((plant) =>
      plant.id === selectedPlant.id
        ? {
            ...plant,
            records: plant.records.filter((record) => record.id !== recordId),
          }
        : plant
    );

    setPlants(updatedPlants);
  };

  const deleteReminder = async (reminder) => {
    if (reminder.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        reminder.notificationId
      );
    }

    const updatedPlants = plants.map((plant) =>
      plant.id === selectedPlant.id
        ? {
            ...plant,
            reminders: plant.reminders.filter((r) => r.id !== reminder.id),
          }
        : plant
    );

    setPlants(updatedPlants);
  };

  const scheduleDailyReminder = async () => {
    if (!selectedPlant) {
      Alert.alert("Warning", "Please select a plant first.");
      return;
    }

    const permission = await Notifications.requestPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Needed", "Please allow notifications.");
      return;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        sound: "default",
      });
    }

    const h = Number(hour);
    const m = Number(minute);

    if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
      Alert.alert("Wrong Time", "Please enter a valid time.");
      return;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Watering Reminder",
        body: `Do not forget to water ${selectedPlant.name}.`,
        sound: "default",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: h,
        minute: m,
      },
    });

    const newReminder = {
      id: Date.now().toString(),
      notificationId,
      hour: h,
      minute: m,
    };

    const updatedPlants = plants.map((plant) =>
      plant.id === selectedPlant.id
        ? { ...plant, reminders: [...plant.reminders, newReminder] }
        : plant
    );

    setPlants(updatedPlants);
    Alert.alert("Reminder Set", `Daily reminder set for ${formatTime(h, m)}.`);
  };

  const formatTime = (h, m) => {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const renderSectionTitle = (title) => (
    <View style={styles.titleBox}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderRecord = (record) => {
    const d = new Date(record.date);

    return (
      <View key={record.id} style={styles.recordCard}>
        <View style={styles.waterMiniCircle}>
          <Text style={styles.recordIcon}>💧</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.recordTitle}>Watered</Text>
          <Text style={styles.recordText}>
            {d.toLocaleDateString([], {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
            {" · "}
            {d.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteRecord(record.id)}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopHeader title="Reminder" />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.bigTitle}>My Plants</Text>

          <TouchableOpacity
            style={styles.headerPlus}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.headerPlusText}>+</Text>
          </TouchableOpacity>
        </View>

        {plants.length === 0 ? (
          <Text style={styles.emptyText}>Add your first plant.</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {plants.map((plant) => (
              <TouchableOpacity
                key={plant.id}
                style={[
                  styles.plantChip,
                  selectedPlantId === plant.id && styles.activePlantChip,
                ]}
                onPress={() => setSelectedPlantId(plant.id)}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text
                    style={[
                      styles.plantChipText,
                      selectedPlantId === plant.id && styles.activePlantChipText,
                    ]}
                  >
                    {plant.name}
                  </Text>
                  <TouchableOpacity onPress={() => deletePlant(plant.id)}>
                    <Text
                      style={[
                        styles.chipDelete,
                        selectedPlantId === plant.id && { color: "#fff" },
                      ]}
                    >
                      ×
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {selectedPlant && (
          <>
            <TouchableOpacity
              style={styles.waterButton}
              onPress={addWateringRecord}
            >
              <Image
                source={require("../../assets/images/water.png")}
                style={styles.waterImage}
              />
              <Text style={styles.waterButtonSub}>add watering</Text>
            </TouchableOpacity>

            {renderSectionTitle("Daily Reminder")}

            <View style={styles.reminderBox}>
              <View style={styles.timeRow}>
                <TextInput
                  value={hour}
                  onChangeText={setHour}
                  keyboardType="numeric"
                  maxLength={2}
                  style={styles.timeInput}
                  placeholder="HH"
                />

                <Text style={styles.colon}>:</Text>

                <TextInput
                  value={minute}
                  onChangeText={setMinute}
                  keyboardType="numeric"
                  maxLength={2}
                  style={styles.timeInput}
                  placeholder="MM"
                />
              </View>

              <TouchableOpacity
                style={styles.reminderButton}
                onPress={scheduleDailyReminder}
              >
                <Text style={styles.reminderButtonText}>Set Reminder</Text>
              </TouchableOpacity>
            </View>

            {selectedPlant.reminders.length > 0 && (
              <View style={{ marginTop: 12 }}>
                {selectedPlant.reminders.map((reminder) => (
                  <View key={reminder.id} style={styles.savedReminderBox}>
                    <Text style={styles.savedReminderText}>
                      🔔 Every day at{" "}
                      {formatTime(reminder.hour, reminder.minute)}
                    </Text>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteReminder(reminder)}
                    >
                      <Text style={styles.deleteIcon}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {renderSectionTitle("Watering History")}

            {selectedPlant.records.length === 0 ? (
              <Text style={styles.emptySmall}>No watering record yet.</Text>
            ) : (
              selectedPlant.records.map(renderRecord)
            )}
          </>
        )}
      </ScrollView>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              What would you like to name your plant?
            </Text>

            <TextInput
              value={newPlantName}
              onChangeText={setNewPlantName}
              placeholder="Example: Balcony flower"
              placeholderTextColor={colors.muted}
              style={styles.modalInput}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setNewPlantName("");
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={addPlant}>
                <Text style={styles.saveText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 120,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  bigTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
  },

  headerPlus: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  headerPlusText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: -2,
  },

  plantChip: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 22,
    marginRight: 10,
    marginTop: 16,
  },

  activePlantChip: {
    backgroundColor: colors.primary,
  },

  plantChipText: {
    color: colors.text,
    fontWeight: "600",
  },

  activePlantChipText: {
    color: "#fff",
  },

  chipDelete: {
    fontSize: 18,
    color: colors.muted,
    fontWeight: "bold",
    marginTop: -1,
  },

  waterButton: {
    width: 165,
    height: 165,
    borderRadius: 90,
    backgroundColor: "#EAF8FF",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#BDEBFA",
  },

  waterImage: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },

  waterButtonSub: {
    color: "#3E9FC4",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },

  titleBox: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginTop: 22,
    marginBottom: 10,
    alignSelf: "flex-start",
  },

  reminderBox: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  timeInput: {
    width: 70,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    textAlign: "center",
    fontSize: 18,
    color: colors.text,
  },

  colon: {
    fontSize: 26,
    marginHorizontal: 10,
    fontWeight: "bold",
    color: colors.text,
  },

  reminderButton: {
    backgroundColor: "#b5d1b3",
    padding: 15,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 15,
  },

  reminderButtonText: {
    fontWeight: "bold",
    color: colors.text,
  },

  savedReminderBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },

  savedReminderText: {
    color: colors.text,
    fontWeight: "600",
    flex: 1,
  },

  recordCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 18,
    marginBottom: 10,
  },

  waterMiniCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EAF7EF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  recordIcon: {
    fontSize: 22,
  },

  recordTitle: {
    fontWeight: "bold",
    color: colors.text,
  },

  recordText: {
    color: colors.muted,
    marginTop: 3,
  },

  deleteButton: {
    padding: 6,
    marginLeft: 10,
  },

  deleteIcon: {
    fontSize: 14,
    color: "#222",
  },

  emptyText: {
    color: colors.muted,
    marginTop: 12,
  },

  emptySmall: {
    color: colors.muted,
    marginBottom: 8,
    marginTop: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  modalBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 26,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 14,
  },

  modalInput: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    color: colors.text,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 18,
  },

  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginRight: 8,
  },

  cancelText: {
    color: colors.muted,
    fontWeight: "bold",
  },

  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 16,
  },

  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
});