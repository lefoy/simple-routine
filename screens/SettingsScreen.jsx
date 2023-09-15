import PropTypes from "prop-types";
import React, { useState, useLayoutEffect } from "react";
import {
  View, Text, Switch, FlatList, StatusBar, TouchableOpacity, Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import uuid from "react-native-uuid";

import { useTheme } from "../ThemeContext";
import getStyles from "../styles";
import getColors from "../styles/colors";

import Loading from "../components/Loading";

import { askForNotificationPermission, clearAllNotifications } from "../lib/notifications";
import { initRoutineTasks } from "../lib/routine";
import { initSettings } from "../lib/settings";

function SettingsScreen({ navigation }) {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const styles                        = getStyles({ isDarkMode });
  const colors                        = getColors({ isDarkMode });

  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings]   = useState({
    isStatusBarHidden     : false,
    isNavBarHidden        : false,
    isNotificationEnabled : false,
    isShowDaysInList      : false,
    isShowStatsInList     : false,
  });

  const toggleSwitch = async (key) => {
    let newValue;
    switch (key) {
    case "isStatusBarHidden":
      StatusBar.setHidden(!settings.isStatusBarHidden);
      newValue = !settings.isStatusBarHidden;
      break;
    case "isNavBarHidden":
      NavigationBar.setVisibilityAsync(settings.isNavBarHidden ? "visible" : "hidden");
      newValue = !settings.isNavBarHidden;
      break;
    case "isNotificationEnabled":
      newValue = settings.isNotificationEnabled
        ? false
        : await askForNotificationPermission();
      if (settings.isNotificationEnabled) {
        await clearAllNotifications();
      }
      break;
    case "isShowDaysInList":
    case "isShowStatsInList":
      newValue = !settings[key];
      break;
    default:
      return;
    }
    setSettings((prevSettings) => ({ ...prevSettings, [key]: newValue }));
    await AsyncStorage.setItem(key, newValue.toString());
  };

  const fetchSettings = async () => {
    const keys        = Object.keys(settings);
    const newSettings = {};
    for (const key of keys) {
      const value      = await AsyncStorage.getItem(key);
      newSettings[key] = value === "true";
    }
    setSettings(newSettings);
    setIsLoading(false);
  };

  useFocusEffect(React.useCallback(() => { fetchSettings(); }, []));

  const settingsData = [
    { label: "Dark Mode", value: isDarkMode, onToggle: () => setIsDarkMode(!isDarkMode) },
    { label: "Hide Status Bar", value: settings.isStatusBarHidden, onToggle: () => toggleSwitch("isStatusBarHidden") },
    { label: "Hide Navigation Bar", value: settings.isNavBarHidden, onToggle: () => toggleSwitch("isNavBarHidden") },
    { label: "Enable Notifications", value: settings.isNotificationEnabled, onToggle: () => toggleSwitch("isNotificationEnabled") },
    { label: "Show Days In Routine List", value: settings.isShowDaysInList, onToggle: () => toggleSwitch("isShowDaysInList") },
    { label: "Show Stats In Routine List", value: settings.isShowStatsInList, onToggle: () => toggleSwitch("isShowStatsInList") },
  ];

  const deleteAnalyticsData = async () => {
    await AsyncStorage.removeItem("history");
    await AsyncStorage.removeItem("analytics");
    await clearAllNotifications();
  };

  const deleteAllData = async () => {
    await AsyncStorage.clear();
    await initRoutineTasks();
    await initSettings();
    await clearAllNotifications();
    navigation.navigate("RoutineList");
  };

  const confirmDeleteAnalyticsData = () => {
    Alert.alert(
      "Are you sure?",
      "This will delete all your analytics data and cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: deleteAnalyticsData },
      ],
      { cancelable: true },
    );
  };

  const confirmDeleteAllData = () => {
    Alert.alert(
      "Are you sure?",
      "This will delete all your data and cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text    : "Delete",
          onPress : () => {
            Alert.alert(
              "Are you really sure?",
              "This will delete all your data and cannot be undone.",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", onPress: deleteAllData },
              ],
              { cancelable: true },
            );
          },
        },
      ],
      { cancelable: true },
    );
  };

  const headerLeft = () => (
    <View style={styles.headerLeftContainer}>
      <Text style={[styles.text, styles.headerTitle]}>Settings</Text>
    </View>
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: "", headerLeft });
  }, [navigation, isDarkMode]);

  const renderSettingItem = ({ item }) => (
    <View style={styles.settingRow}>
      <View style={styles.switchContainer}>
        <Text style={[styles.text, styles.settingText]}>{item.label}</Text>
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          trackColor={{
            false : colors.mediumOpacity,
            true  : colors.text,
          }}
          thumbColor={colors.text}
        />
      </View>
    </View>
  );

  const separator = () => <View style={styles.separator} />;

  const renderFooter = () => (
    <>
      <View style={styles.spacer} />
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={confirmDeleteAnalyticsData}>
          <FontAwesome5 style={styles.buttonIcon} name="trash-alt" size={20} color={colors.delete} />
          <Text style={[styles.text, styles.deleteButtonText]}>Delete Analytics Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.deleteButtonContainer}>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={confirmDeleteAllData}>
          <FontAwesome5 style={styles.buttonIcon} name="trash-alt" size={20} color={colors.delete} />
          <Text style={[styles.text, styles.deleteButtonText]}>Delete All Data</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <>
      <FlatList
        style={styles.container}
        data={settingsData}
        renderItem={renderSettingItem}
        keyExtractor={() => uuid.v4()}
        ItemSeparatorComponent={separator}
        ListFooterComponent={renderFooter}
      />
      {isLoading && <Loading />}
    </>
  );
}

SettingsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate   : PropTypes.func.isRequired,
    setOptions : PropTypes.func.isRequired,
  }).isRequired,
};

export default SettingsScreen;
