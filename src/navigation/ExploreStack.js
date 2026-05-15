import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import PlantDetailScreen from "../screens/PlantDetailScreen";
import DiseaseDetailScreen from "../screens/DiseaseDetailScreen";

const Stack = createNativeStackNavigator();

export default function ExploreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExploreHome" component={HomeScreen} />
      <Stack.Screen name="PlantDetail" component={PlantDetailScreen} />
      <Stack.Screen name="DiseaseDetail" component={DiseaseDetailScreen} />
    </Stack.Navigator>
  );
}