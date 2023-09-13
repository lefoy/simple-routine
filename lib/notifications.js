import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

const notificationSettings = {
  priority    : Notifications.AndroidNotificationPriority.HIGH,
  autoDismiss : false,
  sticky      : true,
};

const askForNotificationPermission = async () => {
  let finalStatus;

  Notifications.setNotificationHandler({
    handleNotification: () => ({
      shouldShowAlert : true,
      shouldPlaySound : false,
      shouldSetBadge  : false,
    }),
  });

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("routines", {
      name       : "routines",
      importance : Notifications.AndroidImportance.MAX,
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    finalStatus                      = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus      = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Failed to get push token for push notification!");
      return false;
    }

    return true;
  }

  console.warn("Must use physical device for Push Notifications");
  return false;
};

const registerNotificationHandler = (navigationRef) => {
  const listener = Notifications.addNotificationResponseReceivedListener(async (event) => {
    if (navigationRef.current) {
      const storedRoutines    = await AsyncStorage.getItem("routines");
      const routines          = storedRoutines ? JSON.parse(storedRoutines) : [];
      const routineInProgress = routines.find((currentRoutine) => currentRoutine.inProgress);

      // If a user clicked on a notification for a routine that is about to start,
      // check if there is a routine that was supposed to start in the last hour
      // and redirect to that routine instead.

      if (!routineInProgress) {
        const now            = new Date();
        const hourAgo        = new Date(now.getTime() - 60 * 60 * 1000);
        const routineToStart = routines.find((currentRoutine) => {
          const routineStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), currentRoutine.hour, currentRoutine.minute);
          return routineStartTime > hourAgo && routineStartTime < now;
        });

        if (routineToStart) {
          navigationRef.current.navigate("RoutineStart", { routineId: routineToStart.id });
          return;
        }
      }

      if (routineInProgress) {
        navigationRef.current.navigate("Routine", { routineId: routineInProgress.id });
      } else {
        navigationRef.current.navigate("RoutineList");
      }
    }
  });

  return listener;
};

const clearAllNotifications = () => Notifications.dismissAllNotificationsAsync();

const cancelRoutineNotification = async (routine) => {
  if (routine.notificationIds) {
    for (const id of routine.notificationIds) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
  }
};

const scheduleRoutineNotification = async (routine) => {
  const storedSetting         = await AsyncStorage.getItem("isNotificationEnabled");
  const isNotificationEnabled = storedSetting ? JSON.parse(storedSetting) : true;

  if (!isNotificationEnabled || !routine.enabled) {
    return;
  }

  await cancelRoutineNotification(routine);

  const newNotificationIds = [];

  for (const [day, isActive] of Object.entries(routine.days)) {
    if (isActive) {
      const weekday = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"].indexOf(day) + 1;
      const trigger = {
        channelId : "routines",
        weekday,
        hour      : parseInt(routine.hour, 10),
        minute    : parseInt(routine.minute, 10),
        repeats   : true,
      };

      const duration            = routine.items.reduce((acc, curr) => acc + curr.avgTime, 0);
      const now                 = new Date();
      const finishTime          = new Date(now.getTime() + duration * 60 * 1000);
      const formattedFinishTime = finishTime.toLocaleTimeString("en-US", {
        hour   : "numeric",
        minute : "numeric",
      });

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title : routine.name,
          body  : `Start now and finish your routine at ${formattedFinishTime}`,
        },
        trigger,
      });
      newNotificationIds.push(notificationId);
    }
  }

  routine.notificationIds = newNotificationIds;

  const storedRoutines = await AsyncStorage.getItem("routines");
  const routines       = storedRoutines ? JSON.parse(storedRoutines) : [];
  const index          = routines.findIndex((r) => r.id === routine.id);

  routines[index] = routine;

  await AsyncStorage.setItem("routines", JSON.stringify(routines));
};

const sendTaskNotification = async ({ title, body }) => {
  const storedSetting         = await AsyncStorage.getItem("isNotificationEnabled");
  const isNotificationEnabled = storedSetting ? JSON.parse(storedSetting) : true;

  if (!isNotificationEnabled) {
    return;
  }

  await clearAllNotifications();

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      ...notificationSettings,
    },
    trigger: null,
  });
};

export {
  askForNotificationPermission,
  registerNotificationHandler,
  clearAllNotifications,
  scheduleRoutineNotification,
  cancelRoutineNotification,
  sendTaskNotification,
};
