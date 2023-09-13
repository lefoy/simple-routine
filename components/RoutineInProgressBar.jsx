import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Alert, Text, TouchableOpacity, View,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "../ThemeContext";
import getStyles from "../styles";
import getColors from "../styles/colors";
import TimeProgress from "./TimeProgress";

function RoutineInProgressBar({ navigation, fallbackComponent }) {
  const { isDarkMode } = useTheme();
  const styles         = getStyles({ isDarkMode });
  const colors         = getColors({ isDarkMode });

  const [routines, setRoutines] = useState([]);

  const fetchRoutines = async () => {
    try {
      const storedRoutines = await AsyncStorage.getItem("routines");
      if (storedRoutines) setRoutines(JSON.parse(storedRoutines));
      else setRoutines([]);
    } catch (error) {
      Alert.alert("Error", "Could not load routines.");
      console.log(error);
    }
  };

  useFocusEffect(React.useCallback(() => { fetchRoutines(); }, []));

  const currentRoutineInProgressIndex = routines.findIndex((routine) => routine.inProgress);
  const currentRoutineInProgress      = routines[currentRoutineInProgressIndex];
  let currentRoutineItemInProgress    = false;

  if (currentRoutineInProgress) {
    const enabledItems           = currentRoutineInProgress.items.filter((item) => item.enabled);
    currentRoutineItemInProgress = enabledItems.find((item) => item.inProgress);
  }

  const openRoutineInProgress = () => {
    navigation.navigate("Routine", { routineId: currentRoutineInProgress.id });
  };

  return currentRoutineInProgress ? (
    <TouchableOpacity style={styles.currentRoutineContainer} onPress={openRoutineInProgress}>
      <View style={styles.row}>
        <View style={styles.currentRoutineContainerLeft}>
          <Text style={[styles.text, styles.title, styles.currentRoutineText]} numberOfLines={2}>{currentRoutineInProgress.name}</Text>
          {currentRoutineItemInProgress && (
            <>
              <View style={styles.currentRoutineItemContainer}>
                <FontAwesome5 name={currentRoutineItemInProgress.emoji} size={16} color={colors.background} />
                <Text style={[styles.text, styles.currentRoutineItemText]}>{currentRoutineItemInProgress.name}</Text>
              </View>
              <TimeProgress item={currentRoutineItemInProgress} isDarkMode={!isDarkMode} />
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  ) : fallbackComponent;
}

RoutineInProgressBar.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  fallbackComponent: PropTypes.element,
};

RoutineInProgressBar.defaultProps = {
  fallbackComponent: <View />,
};

export default RoutineInProgressBar;
