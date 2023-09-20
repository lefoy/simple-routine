import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import PropTypes from "prop-types";
import React, { useLayoutEffect, useState } from "react";
import {
  ScrollView,
  Text, TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../ThemeContext";
import getStyles from "../styles";
import getColors from "../styles/colors";

import HeaderButton from "../components/HeaderButton";
import RoutineInProgressBar from "../components/RoutineInProgressBar";
import RoutineItem from "../components/RoutineItem";

import { getFormattedFinishTime, setRoutineItemEnabled, startRoutine } from "../lib/routine";

function RoutineStartScreen({ route, navigation }) {
  const { isDarkMode } = useTheme();
  const styles         = getStyles({ isDarkMode });
  const colors         = getColors({ isDarkMode });

  const { routineId } = route.params;

  const [routineItems, setRoutineItems] = useState([]);
  const [routineName, setRoutineName]   = useState("");

  const formattedFinishTime = getFormattedFinishTime(routineItems);
  let currentItemIndex      = routineItems.findIndex((item) => item.inProgress);

  if (currentItemIndex === -1) {
    currentItemIndex = routineItems.length - 1;
  }

  const back = () => {
    navigation.goBack();
  };

  const fetchRoutines = async () => {
    const storedRoutines = await AsyncStorage.getItem("routines");
    const routines       = storedRoutines != null ? JSON.parse(storedRoutines) : [];

    const routine = routines.find((current) => current.id === routineId);

    if (routine) {
      setRoutineItems(routine.items);
      setRoutineName(routine.name);
    }
  };

  useFocusEffect(React.useCallback(() => { fetchRoutines(); }, []));

  const start = async () => {
    await startRoutine(routineId);
    navigation.navigate("Routine", { routineId });
  };

  const toggleRoutineItem = async (item) => {
    await setRoutineItemEnabled(routineId, item.id, !item.enabled);
    fetchRoutines();
  };

  const headerLeft = () => (
    <View style={styles.headerLeftContainer}>
      <HeaderButton icon="arrow-left" text="Back" onPress={back} />
    </View>
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: "", headerLeft });
  }, [navigation, isDarkMode]);

  const startButton = (
    <TouchableOpacity style={[styles.button, styles.startRoutineButton]} onPress={start}>
      <View style={styles.row}>
        <Text style={[styles.text, styles.buttonTextBig]}>Start Routine</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.text, styles.buttonText]}>Estimated end time</Text>
        <FontAwesome5 style={styles.buttonInlineIcon} name="clock" size={20} color={colors.background} />
        <Text style={[styles.text, styles.buttonText]}>{formattedFinishTime}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
      <View style={styles.routineHeader}>
        <Text style={[styles.text, styles.title]}>{routineName}</Text>
      </View>

      <View style={styles.routineItemsContainer}>
        {routineItems.map((item) => (
          <View style={[styles.routineEditItemContainer, !item.enabled ? styles.disabled : null]} key={item.id}>
            <TouchableOpacity style={[styles.buttonIconOnly, styles.lowOpacity]} onPress={() => toggleRoutineItem(item)}>
              <FontAwesome5 name={item.enabled ? "check-circle" : "circle"} size={20} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.flexRow}>
              <RoutineItem item={item} />
              {!item.enabled && <View style={styles.routineItemDisabledLine} />}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.spacer} />

      <RoutineInProgressBar navigation={navigation} fallbackComponent={startButton} />
    </ScrollView>
  );
}

RoutineStartScreen.propTypes = {
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

export default RoutineStartScreen;
