import PropTypes from "prop-types";
import React, { useLayoutEffect, useState } from "react";
import {
  View, Text, TouchableOpacity, Alert, ScrollView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "../ThemeContext";
import getStyles from "../styles";
import getColors from "../styles/colors";

import HeaderButton from "../components/HeaderButton";
import Loading from "../components/Loading";
import RoutineItem from "../components/RoutineItem";

import { clearAllNotifications } from "../lib/notifications";

function RoutineSuggestionsScreen({ route, navigation }) {
  const { isDarkMode } = useTheme();
  const styles         = getStyles({ isDarkMode });
  const colors         = getColors({ isDarkMode });

  const { routineName, routineId } = route.params;

  const [isLoading, setIsLoading]     = useState(true);
  const [historyData, setHistoryData] = useState(null);
  const [routine, setRoutine]         = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const calculateSuggestions = () => {
    const newSuggestions = [];

    routine.items.forEach((item) => {
      let diffMins          = 0;
      let historicalAverage = 0;

      const historicalRoutineItems = historyData.reduce((acc, historyRoutine) => {
        if (historyRoutine.id === routineId) {
          return acc.concat(historyRoutine.items.filter((historyItem) => historyItem.id === item.id));
        }
        return acc;
      }, []);

      const latestHistoricalItem = historicalRoutineItems[historicalRoutineItems.length - 1];
      const diffMs               = latestHistoricalItem.timeCompleted - latestHistoricalItem.timeStarted;
      diffMins                   = Math.max(1, Math.round(diffMs / 60 / 1000));

      if (historicalRoutineItems.length > 0) {
        const historicalTotalTime = historicalRoutineItems.reduce((acc, historyItem) => {
          if (historyItem.timeCompleted && historyItem.timeStarted) { return acc + historyItem.timeCompleted - historyItem.timeStarted; }
          return acc;
        }, 0);

        const historicalTotalMins = Math.max(1, Math.round(((historicalTotalTime % 86400000) % 3600000) / 60000));
        historicalAverage         = Math.max(1, Math.round(historicalTotalMins / historicalRoutineItems.length));
      }

      newSuggestions.push({
        taskName   : item.name,
        actualTime : diffMins,
        historicalAverage,
        item,
      });
    });

    setSuggestions(newSuggestions);
    setIsLoading(false);
  };

  const fetchHistory = async () => {
    const storedHistoryData = await AsyncStorage.getItem("history");

    if (storedHistoryData) {
      setHistoryData(JSON.parse(storedHistoryData));
    }
  };

  const fetchRoutine = async () => {
    try {
      const storedRoutines = await AsyncStorage.getItem("routines");
      if (storedRoutines) {
        const routines       = JSON.parse(storedRoutines);
        const currentRoutine = routines.find((item) => item.id === routineId);
        await setRoutine(currentRoutine);
      }
    } catch (error) {
      Alert.alert("Error", "Could not load routines.");
      console.log(error);
    }
  };

  useFocusEffect(React.useCallback(() => {
    const fetchData = async () => {
      await fetchHistory();
      await fetchRoutine();
      calculateSuggestions();
    };

    fetchData();
  }, []));

  const back = async () => {
    navigation.navigate("RoutineList");
    await clearAllNotifications();
  };

  const editRoutineItem = (item) => {
    navigation.navigate("EditRoutineItem", { routineId, item, isCustom: false });
  };

  const headerLeft = () => (
    <View style={styles.headerLeftContainer}>
      <HeaderButton icon="check" text="Finish" onPress={back} />
    </View>
  );

  useLayoutEffect(() => { navigation.setOptions({ title: "", headerLeft }); }, [navigation, isDarkMode]);

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.routineHeader}>
          <Text style={[styles.text, styles.title]}>{routineName}</Text>
        </View>

        {suggestions.map((suggestion) => (
          <TouchableOpacity key={suggestion.taskName} style={styles.suggestionContainer} onPress={() => editRoutineItem(suggestion.item)}>
            <RoutineItem item={suggestion.item} />
            <View style={styles.routineStatsContainer}>
              <View style={styles.routineStatContainer}>
                <Text style={[styles.text, styles.routineStatTitle]}>{`${suggestion.actualTime} min`}</Text>
                <Text style={[styles.text, styles.routineStatText]}>Actual Time</Text>
              </View>
              <View style={styles.routineStatContainer}>
                <Text style={[styles.text, styles.routineStatTitle]}>{`${suggestion.historicalAverage} min`}</Text>
                <Text style={[styles.text, styles.routineStatText]}>Historical Average</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.spacerPadding} />

        <View style={styles.completeButtonContainer}>
          <TouchableOpacity style={[styles.button, styles.completeButton]} onPress={back}>
            <FontAwesome5 style={styles.buttonIcon} name="check" size={20} color={colors.background} />
            <Text style={[styles.text, styles.buttonText]}>Complete Routine</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {isLoading && <Loading />}
    </>
  );
}

RoutineSuggestionsScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      routineId   : PropTypes.string.isRequired,
      routineName : PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate    : PropTypes.func.isRequired,
    setOptions  : PropTypes.func.isRequired,
    addListener : PropTypes.func.isRequired,
  }).isRequired,
};

export default RoutineSuggestionsScreen;
