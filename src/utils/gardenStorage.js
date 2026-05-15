import AsyncStorage from "@react-native-async-storage/async-storage";

const GARDEN_KEY = "MY_GARDEN_SCANS";

export async function getGardenItems() {
  const data = await AsyncStorage.getItem(GARDEN_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveGardenItem(item) {
  const oldItems = await getGardenItems();

  const newItem = {
    id: Date.now().toString(),
    imageUri: item.imageUri,
    diseaseName: item.diseaseName,
    confidence: item.confidence,
    description: item.description,
    date: new Date().toLocaleDateString(),
  };

  const updatedItems = [newItem, ...oldItems];

  await AsyncStorage.setItem(GARDEN_KEY, JSON.stringify(updatedItems));
}

export async function deleteGardenItem(id) {
  const oldItems = await getGardenItems();

  const updatedItems = oldItems.filter((item) => item.id !== id);

  await AsyncStorage.setItem(GARDEN_KEY, JSON.stringify(updatedItems));
}