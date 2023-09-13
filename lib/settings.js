import AsyncStorage from "@react-native-async-storage/async-storage";

const initSettings = async () => {
  const storedFullscreenSettings = await AsyncStorage.getItem("isFullscreenEnabled");
  if (!storedFullscreenSettings) {
    await AsyncStorage.setItem("isFullscreenEnabled", "false");
  }

  const storedNotificationSettings = await AsyncStorage.getItem("isNotificationEnabled");
  if (!storedNotificationSettings) {
    await AsyncStorage.setItem("isNotificationEnabled", "false");
  }

  const storedShowDaysInListSettings = await AsyncStorage.getItem("isShowDaysInList");
  if (!storedShowDaysInListSettings) {
    await AsyncStorage.setItem("isShowDaysInList", "true");
  }

  const storedShowStatsInListSettings = await AsyncStorage.getItem("isShowStatsInList");
  if (!storedShowStatsInListSettings) {
    await AsyncStorage.setItem("isShowStatsInList", "true");
  }
};

export {
  // eslint-disable-next-line import/prefer-default-export
  initSettings,
};
