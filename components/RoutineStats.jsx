import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "../ThemeContext";
import getStyles from "../styles";

function RoutineStats({ routineId }) {
  const { isDarkMode } = useTheme();
  const styles         = getStyles({ isDarkMode });

  const [historyData, setHistoryData]   = useState(null);
  const [routineItems, setRoutineItems] = useState([]);

  const nbTasks  = routineItems.length;
  const duration = routineItems.reduce((acc, curr) => acc + curr.avgTime, 0);
  let completed  = 0;

  const fetchRoutines = async () => {
    const storedRoutines = await AsyncStorage.getItem("routines");
    const routines       = storedRoutines != null ? JSON.parse(storedRoutines) : [];

    const routine = routines.find((current) => current.id === routineId);

    if (routine) {
      setRoutineItems(routine.items);
    }
  };

  const fetchHistory = async () => {
    const storedHistoryData = await AsyncStorage.getItem("history");

    if (storedHistoryData) {
      setHistoryData(JSON.parse(storedHistoryData));
    } else {
      setHistoryData(null);
    }
  };

  useEffect(() => {
    fetchRoutines();
    fetchHistory();
  }, []);

  useFocusEffect(React.useCallback(() => {
    fetchRoutines();
    fetchHistory();
  }, []));

  if (historyData) {
    const routineHistory = historyData.filter((history) => history.id === routineId);
    completed            = routineHistory.length;
  }

  return (
    <View style={styles.routineStatsContainer}>
      <View style={styles.routineStatContainer}>
        <Text style={[styles.text, styles.routineStatTitle]}>{nbTasks}</Text>
        <Text style={[styles.text, styles.routineStatText]}>tasks</Text>
      </View>
      <View style={styles.routineStatContainer}>
        <Text style={[styles.text, styles.routineStatTitle]}>{duration}</Text>
        <Text style={[styles.text, styles.routineStatText]}>min</Text>
      </View>
      <View style={[styles.routineStatContainer, styles.routineStatContainerLast]}>
        <Text style={[styles.text, styles.routineStatTitle]}>{completed}</Text>
        <Text style={[styles.text, styles.routineStatText]}>completions</Text>
      </View>
    </View>
  );
}

RoutineStats.propTypes = {
  routineId: PropTypes.string.isRequired,
};

export default RoutineStats;
