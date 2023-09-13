import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import uuid from "react-native-uuid";

import {
  cancelRoutineNotification, clearAllNotifications, scheduleRoutineNotification, sendTaskNotification,
} from "./notifications";
import getDefaultTasks from "./routineDefaultTasks";

const getRoutineItemStructure = () => ({
  id            : uuid.v4(),
  name          : "",
  emoji         : "clock",
  avgTime       : 5,
  enabled       : true,
  inProgress    : false,
  completed     : false,
  skipped       : false,
  timeStarted   : null,
  timeCompleted : null,
});

const getRoutineStructure = () => ({
  id     : uuid.v4(),
  name   : "",
  hour   : "08",
  minute : "00",
  days   : {
    sun: false, mon: true, tue: true, wed: true, thu: true, fri: true, sat: false,
  },
  enabled       : true,
  inProgress    : false,
  timeCompleted : null,
  items         : [
    {
      ...getRoutineItemStructure(), name: "Make my bed", emoji: "bed", avgTime: 2,
    },
    {
      ...getRoutineItemStructure(), name: "Brush my teeth", emoji: "tooth", avgTime: 3,
    },
    {
      ...getRoutineItemStructure(), name: "Take a shower", emoji: "shower", avgTime: 10,
    },
  ],
});

const resetRoutineItem = (routineItem) => {
  routineItem.completed     = false;
  routineItem.skipped       = false;
  routineItem.inProgress    = false;
  routineItem.timeStarted   = null;
  routineItem.timeCompleted = null;

  return routineItem;
};

const initRoutineTasks = async () => {
  const storedTasks = await AsyncStorage.getItem("tasks");
  if (storedTasks) {
    return;
  }

  const tasks = {
    custom    : [],
    favorites : [],
    default   : getDefaultTasks(getRoutineItemStructure),
  };

  // Save the default tasks
  await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
};

const addCustomRoutineTask = async (task) => {
  try {
    // Fetch all tasks
    const storedTasks = await AsyncStorage.getItem("tasks");
    const tasks       = storedTasks ? JSON.parse(storedTasks) : [];

    // Add the new task
    tasks.custom.push(task);

    // Save back to AsyncStorage
    await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    Alert.alert("Error", "Could not add task.");
    console.log(error);
  }
};

const addRoutine = async (routine) => {
  try {
    // Fetch all routines
    const storedRoutines = await AsyncStorage.getItem("routines");
    const routines       = storedRoutines ? JSON.parse(storedRoutines) : [];

    // Add the new routine
    routines.push(routine);

    // Schedule the notification
    await scheduleRoutineNotification(routine);

    // Save back to AsyncStorage
    await AsyncStorage.setItem("routines", JSON.stringify(routines));
  } catch (error) {
    Alert.alert("Error", "Could not add routine.");
    console.log(error);
  }
};

const deleteRoutine = async (routineId) => {
  try {
    // Fetch all routines
    const storedRoutines = await AsyncStorage.getItem("routines");
    const routines       = storedRoutines ? JSON.parse(storedRoutines) : [];

    // Find and remove the routine
    const routineIndex = routines.findIndex((routine) => routine.id === routineId);
    const routine      = routines[routineIndex];
    if (routineIndex !== -1) {
      routines.splice(routineIndex, 1);

      // Cancel the notifications
      await cancelRoutineNotification(routine);

      // Save back to AsyncStorage
      await AsyncStorage.setItem("routines", JSON.stringify(routines));
    } else {
      Alert.alert("Error", "Routine not found.");
    }
  } catch (error) {
    Alert.alert("Error", "Could not delete routine.");
    console.log(error);
  }
};

const updateRoutine = async (routine) => {
  try {
    // Fetch all routines
    const storedRoutines = await AsyncStorage.getItem("routines");
    const routines       = storedRoutines ? JSON.parse(storedRoutines) : [];

    // Find and update the routine
    const routineIndex = routines.findIndex((r) => r.id === routine.id);
    if (routineIndex !== -1) {
      routines[routineIndex] = routine;

      // Schedule the notification
      await scheduleRoutineNotification(routine);

      // Save back to AsyncStorage
      await AsyncStorage.setItem("routines", JSON.stringify(routines));
    } else {
      Alert.alert("Error", "Routine not found.");
    }
  } catch (error) {
    Alert.alert("Error", "Could not update routine.");
    console.log(error);
  }
};

const updateRoutineItem = async (routineId, routineItem) => {
  try {
    // Fetch all routines
    const storedRoutines = await AsyncStorage.getItem("routines");
    const routines       = storedRoutines ? JSON.parse(storedRoutines) : [];

    // Find and update the routine item
    const routineIndex = routines.findIndex((r) => r.id === routineId);
    if (routineIndex !== -1) {
      const routine          = routines[routineIndex];
      const routineItemIndex = routine.items.findIndex((i) => i.id === routineItem.id);
      if (routineItemIndex !== -1) {
        routine.items[routineItemIndex] = routineItem;

        // Save back to AsyncStorage
        await AsyncStorage.setItem("routines", JSON.stringify(routines));
      } else {
        routine.items.push(routineItem);

        // Save back to AsyncStorage
        await AsyncStorage.setItem("routines", JSON.stringify(routines));
      }
    } else {
      Alert.alert("Error", "Routine not found.");
    }
  } catch (error) {
    Alert.alert("Error", "Could not update routine item.");
    console.log(error);
  }
};

const deleteRoutineItem = async (routineId, routineItemId) => {
  try {
    // Fetch all routines
    const storedRoutines = await AsyncStorage.getItem("routines");
    const routines       = storedRoutines ? JSON.parse(storedRoutines) : [];

    // Find and update the routine item
    const routineIndex = routines.findIndex((r) => r.id === routineId);
    if (routineIndex !== -1) {
      const routine          = routines[routineIndex];
      const routineItemIndex = routine.items.findIndex((i) => i.id === routineItemId);
      if (routineItemIndex !== -1) {
        routine.items.splice(routineItemIndex, 1);

        // Save back to AsyncStorage
        await AsyncStorage.setItem("routines", JSON.stringify(routines));
      } else {
        Alert.alert("Error", "Routine item not found.");
      }
    } else {
      Alert.alert("Error", "Routine not found.");
    }
  } catch (error) {
    Alert.alert("Error", "Could not delete routine item.");
    console.log(error);
  }
};

const setRoutineItemEnabled = async (routineId, routineItemId, enabled) => {
  try {
    // Fetch all routines
    const storedRoutines = await AsyncStorage.getItem("routines");
    const routines       = storedRoutines ? JSON.parse(storedRoutines) : [];

    // Find and update the routine item
    const routineIndex = routines.findIndex((r) => r.id === routineId);
    if (routineIndex !== -1) {
      const routine          = routines[routineIndex];
      const routineItemIndex = routine.items.findIndex((i) => i.id === routineItemId);
      if (routineItemIndex !== -1) {
        routine.items[routineItemIndex].enabled = enabled;

        // Save back to AsyncStorage
        await AsyncStorage.setItem("routines", JSON.stringify(routines));
      } else {
        Alert.alert("Error", "Routine item not found.");
      }
    } else {
      Alert.alert("Error", "Routine not found.");
    }
  } catch (error) {
    Alert.alert("Error", "Could not disable routine item.");
    console.log(error);
  }
};

const startRoutineItem = async (routineId, routineItemId) => {
  try {
    // Fetch all routines
    const storedRoutines = await AsyncStorage.getItem("routines");
    const routines       = storedRoutines ? JSON.parse(storedRoutines) : [];

    // Find and update the routine item
    const routineIndex = routines.findIndex((r) => r.id === routineId);
    if (routineIndex !== -1) {
      const routine          = routines[routineIndex];
      const routineItemIndex = routine.items.findIndex((i) => i.id === routineItemId);
      if (routineItemIndex !== -1) {
        routine.items[routineItemIndex].inProgress    = true;
        routine.items[routineItemIndex].timeStarted   = Date.now();
        routine.items[routineItemIndex].timeCompleted = null;

        // Send the notification
        try {
          await sendTaskNotification({
            title : `In Progress: ${routine.name}`,
            body  : `Current Task: ${routine.items[routineItemIndex].name}`,
          });
        } catch (error) {
          console.log(error);
        }

        // Save back to AsyncStorage
        await AsyncStorage.setItem("routines", JSON.stringify(routines));
      } else {
        Alert.alert("Error", "Routine item not found.");
      }
    } else {
      Alert.alert("Error", "Routine not found.");
    }
  } catch (error) {
    Alert.alert("Error", "Could not start routine item.");
    console.log(error);
  }
};

const startRoutine = async (routineId) => {
  try {
    // Fetch all routines
    const storedRoutines = await AsyncStorage.getItem("routines");
    const routines       = storedRoutines ? JSON.parse(storedRoutines) : [];

    // Find and update the routine
    const routineIndex = routines.findIndex((r) => r.id === routineId);
    if (routineIndex !== -1) {
      const routine      = routines[routineIndex];
      routine.inProgress = true;

      // Stop all other routines
      routines.forEach((currentRoutine) => {
        if (currentRoutine.id !== routineId) {
          currentRoutine.inProgress = false;

          // Reset all routine items
          currentRoutine.items.forEach(resetRoutineItem);
        }
      });

      // Reset all routine items
      routine.items.forEach(resetRoutineItem);

      // Save back to AsyncStorage
      await AsyncStorage.setItem("routines", JSON.stringify(routines));

      // Start the first routine item
      if (routine.items.length > 0) {
        const firstEnabledItem = routine.items.find((item) => item.enabled);
        if (firstEnabledItem) {
          await startRoutineItem(routineId, firstEnabledItem.id);
        }
      }
    } else {
      Alert.alert("Error", "Routine not found.");
    }
  } catch (error) {
    Alert.alert("Error", "Could not start routine.");
    console.log(error);
  }
};

const stopRoutine = async (routineId) => {
  try {
    // Fetch all routines
    const storedRoutines = await AsyncStorage.getItem("routines");
    const routines       = storedRoutines ? JSON.parse(storedRoutines) : [];

    // Find and update the routine
    const routineIndex = routines.findIndex((r) => r.id === routineId);
    if (routineIndex !== -1) {
      const routine      = routines[routineIndex];
      routine.inProgress = false;

      // Reset all routine items
      routine.items.forEach(resetRoutineItem);

      await clearAllNotifications();

      // Save back to AsyncStorage
      await AsyncStorage.setItem("routines", JSON.stringify(routines));
    } else {
      Alert.alert("Error", "Routine not found.");
    }
  } catch (error) {
    Alert.alert("Error", "Could not stop routine.");
    console.log(error);
  }
};

const completeRoutine = async (routineId) => {
  try {
    // Fetch all routines
    const storedRoutines = await AsyncStorage.getItem("routines");
    const routines       = storedRoutines ? JSON.parse(storedRoutines) : [];

    // Find and update the routine
    const routineIndex = routines.findIndex((r) => r.id === routineId);
    if (routineIndex !== -1) {
      const routine      = routines[routineIndex];
      routine.inProgress = false;

      // Add the routine to the history
      const storedHistory = await AsyncStorage.getItem("history");
      const history       = storedHistory ? JSON.parse(storedHistory) : [];
      const historyEntry  = { ...routine, timeCompleted: Date.now() };
      history.push(historyEntry);
      await AsyncStorage.setItem("history", JSON.stringify(history));

      // Reset all routine items
      routine.items.forEach(resetRoutineItem);

      // Save back to AsyncStorage
      await AsyncStorage.setItem("routines", JSON.stringify(routines));
    } else {
      Alert.alert("Error", "Routine not found.");
    }
  } catch (error) {
    Alert.alert("Error", "Could not stop routine.");
    console.log(error);
  }
};

const previousRoutineItem = async (routineId, routineItemId) => {
  try {
    // Fetch all routines
    const storedRoutines = await AsyncStorage.getItem("routines");
    const routines       = storedRoutines ? JSON.parse(storedRoutines) : [];

    // Find and update the routine item
    const routineIndex = routines.findIndex((r) => r.id === routineId);
    if (routineIndex !== -1) {
      const routine          = routines[routineIndex];
      const enabledItems     = routine.items.filter((item) => item.enabled);
      const routineItemIndex = enabledItems.findIndex((i) => i.id === routineItemId);
      if (routineItemIndex !== -1) {
        enabledItems[routineItemIndex].inProgress = false;
        enabledItems[routineItemIndex].completed  = false;
        enabledItems[routineItemIndex].skipped    = false;

        // Save back to AsyncStorage
        await AsyncStorage.setItem("routines", JSON.stringify(routines));

        // Start the previous routine item
        if (routineItemIndex - 1 < enabledItems.length) {
          const prevRoutineItem = enabledItems[routineItemIndex - 1];
          await startRoutineItem(routineId, prevRoutineItem.id);
        }
      } else {
        Alert.alert("Error", "Routine item not found.");
      }
    } else {
      Alert.alert("Error", "Routine not found.");
    }
  } catch (error) {
    Alert.alert("Error", "Could not skip routine item.");
    console.log(error);
  }
};

const completeRoutineItem = async (routineId, routineItemId) => {
  try {
    // Fetch all routines
    const storedRoutines = await AsyncStorage.getItem("routines");
    const routines       = storedRoutines ? JSON.parse(storedRoutines) : [];

    // Find and update the routine item
    const routineIndex = routines.findIndex((r) => r.id === routineId);
    if (routineIndex !== -1) {
      const routine          = routines[routineIndex];
      const enabledItems     = routine.items.filter((item) => item.enabled);
      const routineItemIndex = enabledItems.findIndex((i) => i.id === routineItemId);
      if (routineItemIndex !== -1) {
        const currentRoutineItem         = enabledItems[routineItemIndex];
        currentRoutineItem.inProgress    = false;
        currentRoutineItem.completed     = true;
        currentRoutineItem.skipped       = false;
        currentRoutineItem.timeCompleted = Date.now();

        // Save back to AsyncStorage
        await AsyncStorage.setItem("routines", JSON.stringify(routines));

        // Start the next routine item
        if (routineItemIndex + 1 < enabledItems.length) {
          const nextRoutineItem = enabledItems[routineItemIndex + 1];
          await startRoutineItem(routineId, nextRoutineItem.id);
        }
      } else {
        Alert.alert("Error", "Routine item not found.");
      }
    } else {
      Alert.alert("Error", "Routine not found.");
    }
  } catch (error) {
    Alert.alert("Error", "Could not complete routine item.");
    console.log(error);
  }
};

const skipRoutineItem = async (routineId, routineItemId) => {
  try {
    // Fetch all routines
    const storedRoutines = await AsyncStorage.getItem("routines");
    const routines       = storedRoutines ? JSON.parse(storedRoutines) : [];

    // Find and update the routine item
    const routineIndex = routines.findIndex((r) => r.id === routineId);
    if (routineIndex !== -1) {
      const routine          = routines[routineIndex];
      const enabledItems     = routine.items.filter((item) => item.enabled);
      const routineItemIndex = enabledItems.findIndex((i) => i.id === routineItemId);
      if (routineItemIndex !== -1) {
        const currentRoutineItem         = enabledItems[routineItemIndex];
        currentRoutineItem.inProgress    = false;
        currentRoutineItem.completed     = false;
        currentRoutineItem.skipped       = true;
        currentRoutineItem.timeCompleted = Date.now();

        // Save back to AsyncStorage
        await AsyncStorage.setItem("routines", JSON.stringify(routines));

        // Start the next routine item
        if (routineItemIndex + 1 < enabledItems.length) {
          const nextRoutineItem = enabledItems[routineItemIndex + 1];
          await startRoutineItem(routineId, nextRoutineItem.id);
        }
      } else {
        Alert.alert("Error", "Routine item not found.");
      }
    } else {
      Alert.alert("Error", "Routine not found.");
    }
  } catch (error) {
    Alert.alert("Error", "Could not skip routine item.");
    console.log(error);
  }
};

const getFormattedFinishTime = (items) => {
  const remainingItems      = items.filter((item) => !item.completed && !item.skipped && item.enabled);
  const duration            = remainingItems.reduce((acc, curr) => acc + curr.avgTime, 0);
  const now                 = new Date();
  const finishTime          = new Date(now.getTime() + duration * 60 * 1000);
  const formattedFinishTime = finishTime.toLocaleTimeString("en-US", {
    hour   : "numeric",
    minute : "numeric",
  });

  return formattedFinishTime;
};

export {
  getRoutineItemStructure,
  getRoutineStructure,
  initRoutineTasks,
  addCustomRoutineTask,
  addRoutine,
  deleteRoutine,
  updateRoutine,
  updateRoutineItem,
  deleteRoutineItem,
  setRoutineItemEnabled,
  startRoutine,
  stopRoutine,
  completeRoutine,
  startRoutineItem,
  previousRoutineItem,
  completeRoutineItem,
  skipRoutineItem,
  getFormattedFinishTime,
};
