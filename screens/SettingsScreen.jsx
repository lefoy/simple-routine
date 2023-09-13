import PropTypes from "prop-types";
import React, { useState, useLayoutEffect } from "react";
import {
  View, Text, Switch, FlatList, StatusBar, TouchableOpacity, Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";

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

  const [isLoading, setIsLoading]                       = useState(true);
  const [isFullscreenEnabled, setFullscreenEnabled]     = useState(false);
  const [isNotificationEnabled, setNotificationEnabled] = useState(false);
  const [isShowDaysInList, setShowDaysInList]           = useState(false);
  const [isShowStatsInList, setShowStatsInList]         = useState(false);

  const fetchSettings = async () => {
    const isFullscreenEnabledSetting = await AsyncStorage.getItem("isFullscreenEnabled");
    setFullscreenEnabled(isFullscreenEnabledSetting === "true");

    const isNotificationEnabledSetting = await AsyncStorage.getItem("isNotificationEnabled");
    setNotificationEnabled(isNotificationEnabledSetting === "true");

    const isShowDaysInListSetting = await AsyncStorage.getItem("isShowDaysInList");
    setShowDaysInList(isShowDaysInListSetting === "true");

    const isShowStatsInListSetting = await AsyncStorage.getItem("isShowStatsInList");
    setShowStatsInList(isShowStatsInListSetting === "true");

    setIsLoading(false);
  };

  useFocusEffect(React.useCallback(() => { fetchSettings(); }, []));

  const toggleFullscreenSwitch = async () => {
    let enabled;
    if (!isFullscreenEnabled) {
      StatusBar.setHidden(true);
      NavigationBar.setVisibilityAsync("hidden");
      enabled = true;
    } else {
      StatusBar.setHidden(false);
      NavigationBar.setVisibilityAsync("visible");
      enabled = false;
    }
    setFullscreenEnabled(enabled);
    await AsyncStorage.setItem("isFullscreenEnabled", enabled.toString());
  };

  const toggleNotificationSwitch = async () => {
    let enabled;
    if (!isNotificationEnabled) {
      enabled = await askForNotificationPermission();
    } else {
      await clearAllNotifications();
      enabled = false;
    }
    setNotificationEnabled(enabled);
    await AsyncStorage.setItem("isNotificationEnabled", enabled.toString());
  };

  const toggleShowDaysInListSwitch = async () => {
    let enabled;
    if (!isShowDaysInList) {
      enabled = true;
    } else {
      enabled = false;
    }
    setShowDaysInList(enabled);
    await AsyncStorage.setItem("isShowDaysInList", enabled.toString());
  };

  const toggleShowStatsInListSwitch = async () => {
    let enabled;
    if (!isShowStatsInList) {
      enabled = true;
    } else {
      enabled = false;
    }
    setShowStatsInList(enabled);
    await AsyncStorage.setItem("isShowStatsInList", enabled.toString());
  };

  const settingsData = [
    {
      id: "1", label: "Dark Mode", value: isDarkMode, onToggle: (value) => setIsDarkMode(value),
    },
    {
      id: "2", label: "Fullscreen", value: isFullscreenEnabled, onToggle: toggleFullscreenSwitch,
    },
    {
      id: "3", label: "Enable Notifications", value: isNotificationEnabled, onToggle: toggleNotificationSwitch,
    },
    {
      id: "4", label: "Show Days In Routine List", value: isShowDaysInList, onToggle: toggleShowDaysInListSwitch,
    },
    {
      id: "5", label: "Show Stats In Routine List", value: isShowStatsInList, onToggle: toggleShowStatsInListSwitch,
    },
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
  }, [navigation, isDarkMode, isShowDaysInList, isShowStatsInList]);

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
        keyExtractor={(item) => item.id}
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
