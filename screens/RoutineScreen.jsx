import PropTypes from "prop-types";
import {
  View, Text, TouchableOpacity, Alert,
} from "react-native";
import React, { useState, useLayoutEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as StoreReview from "expo-store-review";

import { useTheme } from "../ThemeContext";
import getStyles from "../styles";
import getColors from "../styles/colors";

import HeaderButton from "../components/HeaderButton";
import TimeProgress from "../components/TimeProgress";
import RoutineProgress from "../components/RoutineProgress";
import Loading from "../components/Loading";

import {
  stopRoutine,
  previousRoutineItem,
  completeRoutineItem,
  skipRoutineItem,
  completeRoutine,
  getFormattedFinishTime,
} from "../lib/routine";

function RoutineScreen({ route, navigation }) {
  const { isDarkMode } = useTheme();
  const styles         = getStyles({ isDarkMode });
  const colors         = getColors({ isDarkMode });

  const { routineId } = route.params;

  const [routineItems, setRoutineItems] = useState([]);
  const [routineName, setRoutineName]   = useState("");

  const back = () => {
    navigation.navigate("RoutineList");
  };

  const stop = async () => {
    await stopRoutine(routineId);
    navigation.navigate("RoutineList");
  };

  const confirmStop = () => {
    Alert.alert(
      "Stop Routine",
      "Are you sure you want to stop this routine?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Stop", onPress: stop },
      ],
    );
  };

  const checkForCompletion = async (items) => {
    if (items.every((item) => item.completed || item.skipped)) {
      await completeRoutine(routineId);
      if (await StoreReview.hasAction()) {
        StoreReview.requestReview();
      }

      navigation.navigate("RoutineCompleted", { routineId, routineName });
    }
  };

  const fetchRoutines = async () => {
    const storedRoutines = await AsyncStorage.getItem("routines");
    const routines       = storedRoutines != null ? JSON.parse(storedRoutines) : [];

    const routine = routines.find((current) => current.id === routineId);

    if (routine) {
      const items = routine.items.filter((item) => item.enabled);
      setRoutineName(routine.name);
      setRoutineItems(items);
      checkForCompletion(items);
    }
  };

  useFocusEffect(React.useCallback(() => { fetchRoutines(); }, []));

  const headerLeft = () => (
    <View style={styles.headerLeftContainer}>
      <HeaderButton icon="arrow-left" text="Back" onPress={back} />
    </View>
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: "", headerLeft });
  }, [navigation, isDarkMode]);

  let currentItemIndex = routineItems.findIndex((item) => item.inProgress);

  if (currentItemIndex === -1) {
    currentItemIndex = routineItems.length - 1;
  }

  const currentItem         = routineItems[currentItemIndex];
  const previousItem        = routineItems[currentItemIndex - 1];
  const nextItem            = routineItems[currentItemIndex + 1];
  const formattedFinishTime = getFormattedFinishTime(routineItems);

  const prevItem = async () => {
    await previousRoutineItem(routineId, currentItem.id);
    fetchRoutines();
  };

  const completeItem = async () => {
    await completeRoutineItem(routineId, currentItem.id);
    fetchRoutines();
  };

  const skipItem = async () => {
    await skipRoutineItem(routineId, currentItem.id);
    fetchRoutines();
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.routineHeader}>
          <Text style={[styles.text, styles.title]} numberOfLines={2}>{routineName}</Text>
        </View>

        <View style={styles.routineCurrentItemContainer}>
          <FontAwesome5 name={currentItem ? currentItem.emoji : "clock"} size={100} color={colors.text} />
          <Text style={[styles.text, styles.routineCurrentItemText]}>
            {currentItem ? currentItem.name : "No item in progress"}
          </Text>
        </View>

        <View style={styles.routineMiddleContainer}>
          <View style={styles.routineItemProgressContainer}>
            {currentItem && <TimeProgress item={currentItem} isDarkMode={isDarkMode} />}
          </View>

          <View style={styles.routineProgressContainer}>
            <RoutineProgress items={routineItems} currentIndex={currentItemIndex} isDarkMode={isDarkMode} />
          </View>
        </View>

        <View style={styles.routineButtonsContainer}>
          {previousItem ? (
            <TouchableOpacity style={[styles.button, styles.routineButton]} onPress={prevItem}>
              <FontAwesome5 name="arrow-left" size={40} color={colors.text} />
            </TouchableOpacity>
          ) : (
            <View style={[styles.button, styles.routineButton]} />
          )}
          {currentItem ? (
            <TouchableOpacity style={[styles.button, styles.routineButton]} onPress={completeItem}>
              <View style={styles.routineButtonCircle} />
              <FontAwesome5 name="check" size={60} color={colors.text} />
            </TouchableOpacity>
          ) : (
            <View style={[styles.button, styles.routineButton]} />
          )}
          <TouchableOpacity style={[styles.button, styles.routineButton]} onPress={skipItem}>
            <FontAwesome5 name="arrow-right" size={40} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.routineNextItemContainer}>
          <View style={styles.row}>
            <FontAwesome5 style={styles.routineNextItemIcon} name="clock" size={16} color={colors.highOpacity} />
            <Text style={[styles.text, styles.routineNextItemTitle]}>Up Next</Text>
          </View>
          {nextItem ? (
            <View style={styles.row}>
              <FontAwesome5 style={styles.routineNextItemIcon} name={nextItem.emoji} size={24} color={colors.text} />
              <Text style={[styles.text, styles.routineNextItemText]}>{nextItem.name}</Text>
            </View>
          ) : (
            <View style={styles.row}>
              <FontAwesome5 name="trophy" size={24} color={colors.text} />
              <Text style={[styles.text, styles.routineNextItemText]}>Completed!</Text>
            </View>
          )}
        </View>

        <View style={styles.routineEstimateContainer}>
          <Text style={[styles.text, styles.estimateText]}>Estimated end time</Text>
          <FontAwesome5 style={styles.buttonInlineIcon} name="clock" size={20} color={colors.highOpacity} />
          <Text style={[styles.text, styles.estimateText]}>{formattedFinishTime}</Text>
        </View>

        <View style={styles.spacer} />

        <View style={styles.stopButtonContainer}>
          <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={confirmStop}>
            <FontAwesome5 style={styles.buttonIcon} name="times" size={16} color={colors.text} />
            <Text style={[styles.text, styles.stopButtonText]}>Stop Routine</Text>
          </TouchableOpacity>
        </View>
      </View>
      {!currentItem && <Loading />}
    </>
  );
}

RoutineScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      routineId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate   : PropTypes.func.isRequired,
    goBack     : PropTypes.func.isRequired,
    setOptions : PropTypes.func.isRequired,
  }).isRequired,
};

export default RoutineScreen;
