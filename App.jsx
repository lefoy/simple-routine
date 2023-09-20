import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Font from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import { SplashScreen } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StatusBar, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemeProvider, useTheme } from "./ThemeContext";
import getStyles from "./styles";

import Loading from "./components/Loading";
import AddRoutineItemScreen from "./screens/AddRoutineItemScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";
import DebugScreen from "./screens/DebugScreen";
import RoutineCompletedScreen from "./screens/RoutineCompletedScreen";
import RoutineEditItemScreen from "./screens/RoutineEditItemScreen";
import RoutineEditScreen from "./screens/RoutineEditScreen";
import RoutineListScreen from "./screens/RoutineListScreen";
import RoutineScreen from "./screens/RoutineScreen";
import RoutineStartScreen from "./screens/RoutineStartScreen";
import RoutineSuggestionsScreen from "./screens/RoutineSuggestionsScreen";
import SettingsScreen from "./screens/SettingsScreen";

import { askForNotificationPermission, registerNotificationHandler } from "./lib/notifications";
import { initRoutineTasks } from "./lib/routine";
import { initSettings } from "./lib/settings";

const Tab          = createBottomTabNavigator();
const RoutineStack = createStackNavigator();

SplashScreen.preventAutoHideAsync();

function RoutineStackScreen() {
  const { isDarkMode } = useTheme();
  const styles         = getStyles({ isDarkMode });

  return (
    <RoutineStack.Navigator
      screenOptions={{
        headerStyle      : styles.header,
        headerTitleStyle : styles.headerTitle,
        headerTintColor  : styles.headerTintColor,
      }}
    >
      <RoutineStack.Screen name="RoutineList" component={RoutineListScreen} />
      <RoutineStack.Screen name="Routine" component={RoutineScreen} />
      <RoutineStack.Screen name="RoutineStart" component={RoutineStartScreen} />
      <RoutineStack.Screen name="RoutineCompleted" component={RoutineCompletedScreen} />
      <RoutineStack.Screen name="RoutineSuggestions" component={RoutineSuggestionsScreen} />
      <RoutineStack.Screen name="EditRoutine" component={RoutineEditScreen} />
      <RoutineStack.Screen name="AddRoutineItem" component={AddRoutineItemScreen} />
      <RoutineStack.Screen name="EditRoutineItem" component={RoutineEditItemScreen} />
    </RoutineStack.Navigator>
  );
}

function SettingsStackScreen() {
  const { isDarkMode } = useTheme();
  const styles         = getStyles({ isDarkMode });

  return (
    <RoutineStack.Navigator
      screenOptions={{
        headerStyle      : styles.header,
        headerTitleStyle : styles.headerTitle,
        headerTintColor  : styles.headerTintColor,
      }}
    >
      <RoutineStack.Screen name="EditSettings" component={SettingsScreen} />
      <RoutineStack.Screen name="Debug" component={DebugScreen} />
    </RoutineStack.Navigator>
  );
}

// Load default data
initRoutineTasks();
askForNotificationPermission((notificationPermissionGranted) => {
  initSettings(notificationPermissionGranted);
});

function App() {
  const { isDarkMode } = useTheme();
  const styles         = getStyles({ isDarkMode });

  const navigationRef                             = useRef(null);
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  const [fontsLoaded, setFontsLoaded]               = useState(false);
  const [isFullscreenEnabled, setFullscreenEnabled] = useState(false);

  const fetchSettings = async () => {
    const fullscreenSetting = await AsyncStorage.getItem("isFullscreenEnabled");
    setFullscreenEnabled(fullscreenSetting === "true");

    if (isFullscreenEnabled) {
      StatusBar.setHidden(true);
      NavigationBar.setVisibilityAsync("hidden");
    } else {
      StatusBar.setHidden(false);
      NavigationBar.setVisibilityAsync("visible");
    }
  };

  fetchSettings();

  useEffect(() => {
    if (isNavigationReady) {
      const listener = registerNotificationHandler(navigationRef);
      return () => {
        listener.remove();
      };
    }

    return undefined;
  }, [isNavigationReady]);

  // Load fonts
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Poppins-Regular" : require("./assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Bold"    : require("./assets/fonts/Poppins-Bold.ttf"),
        "Poppins-Black"   : require("./assets/fonts/Poppins-Black.ttf"),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  useEffect(() => {
    // Trigger a re-render when isDarkMode changes
  }, [isDarkMode]);

  // Show loading screen while fonts are being loaded
  if (!fontsLoaded) {
    return <Loading />;
  }

  const Theme = {
    dark   : isDarkMode,
    colors : {
      background: isDarkMode ? "black" : "white",
    },
  };

  const tabBarIcon = ({ route, color, size }) => {
    let iconName;

    if (route.name === "Routines") {
      iconName = "clock";
    } else if (route.name === "Analytics") {
      iconName = "chart-bar";
    } else if (route.name === "Settings") {
      iconName = "cog";
    }

    return <FontAwesome5 name={iconName} size={size} color={color} />;
  };

  const tabBarLabel = ({ route, color }) => (
    <Text style={[styles.tabBarLabel, { color }]}>{route.name}</Text>
  );

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "black" : "white"}
      />
      <NavigationContainer
        theme={Theme}
        ref={navigationRef}
        onReady={() => setIsNavigationReady(true)}
      >
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerStyle             : styles.header,
            headerTitleStyle        : styles.headerTitle,
            headerTintColor         : styles.headerTintColor,
            tabBarActiveTintColor   : isDarkMode ? "white" : "black",
            tabBarInactiveTintColor : isDarkMode ? "grey" : "grey",
            tabBarStyle             : styles.tabBar,
            tabBarLabel             : ({ color }) => tabBarLabel({ route, color }),
            tabBarIcon              : ({ color, size }) => tabBarIcon({ route, color, size }),
          })}
        >
          <Tab.Screen name="Routines" component={RoutineStackScreen} options={{ headerShown: false }} />
          <Tab.Screen name="Analytics" component={AnalyticsScreen} />
          <Tab.Screen name="Settings" component={SettingsStackScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

function RootApp() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default RootApp;
