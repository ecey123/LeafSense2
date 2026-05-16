import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ScanScreen from "../screens/ScanScreen";
import DiseaseDetailScreen from "../screens/DiseaseDetailScreen";

const Stack = createNativeStackNavigator();

export default function ScanStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ScanHome" component={ScanScreen} />
      <Stack.Screen name="DiseaseDetail" component={DiseaseDetailScreen} />
    </Stack.Navigator>
  );
}