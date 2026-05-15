import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../constants/colors";

import ExploreStack from "./ExploreStack";
import BlogStack from "./BlogStack";
import BlogScreen from "../screens/BlogScreen";
import ScanScreen from "../screens/ScanScreen";
import ReminderScreen from "../screens/ReminderScreen";
import MyGardenScreen from "../screens/MyGardenScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Explore"
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarShowLabel: true,
        tabBarStyle: {
          position: "absolute",
          bottom: 18,
          left: 18,
          right: 18,
          height: 78,
          borderRadius: 32,
          backgroundColor: colors.white,
          borderTopWidth: 0,
          elevation: 4,

          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowOffset: { width: 0, height: 3 },
          shadowRadius: 8,

          paddingTop: 8,
          paddingBottom: 10,
        },

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },

        tabBarIcon: ({ focused, color }) => {
          if (route.name === "Explore") {
            return <Ionicons name="book-outline" size={24} color={color} />;
          }

          if (route.name === "Blog") {
            return (
              <MaterialCommunityIcons
                name="flower-outline"
                size={24}
                color={color}
              />
            );
          }

          if (route.name === "Scan") {
            return (
              <View
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 31,
                  backgroundColor: colors.white,
                  justifyContent: "center",
                  alignItems: "center",
                  transform: [{ translateY: -18 }],
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    borderWidth: 2,
                    borderColor: focused
                      ? colors.primary
                      : colors.muted,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="scan-outline" size={23} color={color} />
                </View>
              </View>
            );
          }

          if (route.name === "Reminder") {
            return (
              <Ionicons
                name="notifications-outline"
                size={24}
                color={color}
              />
            );
          }

          if (route.name === "My Garden") {
            return (
              <MaterialCommunityIcons
                name="sprout-outline"
                size={25}
                color={color}
              />
            );
          }
        },
      })}
    >
      <Tab.Screen name="Explore" component={ExploreStack} />
      <Tab.Screen name="Blog" component={BlogStack} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Reminder" component={ReminderScreen} />
      <Tab.Screen name="My Garden" component={MyGardenScreen} />
    </Tab.Navigator>
  );
}