import AsyncStorage from "@react-native-async-storage/async-storage";

const initSettings = async (notificationPermissionGranted) => {
  const storedStatusBarSettings = await AsyncStorage.getItem("isStatusBarHidden");
  if (!storedStatusBarSettings) {
    await AsyncStorage.setItem("isStatusBarHidden", "false");
  }

  const storedNavBarSettings = await AsyncStorage.getItem("isNavBarHidden");
  if (!storedNavBarSettings) {
    await AsyncStorage.setItem("isNavBarHidden", "false");
  }

  const storedNotificationSettings = await AsyncStorage.getItem("isNotificationEnabled");
  if (!storedNotificationSettings) {
    if (notificationPermissionGranted) {
      await AsyncStorage.setItem("isNotificationEnabled", "true");
    } else {
      await AsyncStorage.setItem("isNotificationEnabled", "false");
    }
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
