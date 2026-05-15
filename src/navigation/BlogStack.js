import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BlogScreen from "../screens/BlogScreen";
import BlogDetailScreen from "../screens/BlogDetailScreen";

const Stack = createNativeStackNavigator();

export default function BlogStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="BlogMain"
        component={BlogScreen}
      />

      <Stack.Screen
        name="BlogDetail"
        component={BlogDetailScreen}
      />
    </Stack.Navigator>
  );
}