import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./src/screens/SplashScreen";
import BottomTabs from "./src/navigation/BottomTabs";
import GardenDetailScreen from "./src/screens/GardenDetailScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="BottomTabs"
          component={BottomTabs}
        />

        <Stack.Screen
          name="GardenDetail"
          component={GardenDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}