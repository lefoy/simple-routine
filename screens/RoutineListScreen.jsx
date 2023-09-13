import { useFocusEffect } from "@react-navigation/native";
import PropTypes from "prop-types";
import {
  View, Text, FlatList, TouchableOpacity, Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useLayoutEffect } from "react";

import { useTheme } from "../ThemeContext";
import getStyles from "../styles";

import HeaderButton from "../components/HeaderButton";
import Loading from "../components/Loading";
import RoutineInProgressBar from "../components/RoutineInProgressBar";
import RoutineStats from "../components/RoutineStats";

import { getRoutineStructure, addRoutine } from "../lib/routine";

function RoutineListScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const styles         = getStyles({ isDarkMode });

  const [isLoading, setIsLoading]               = useState(true);
  const [routines, setRoutines]                 = useState([]);
  const [isShowDaysInList, setShowDaysInList]   = useState(false);
  const [isShowStatsInList, setShowStatsInList] = useState(false);

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

  const fetchSettings = async () => {
    const isShowDaysInListSetting = await AsyncStorage.getItem("isShowDaysInList");
    setShowDaysInList(isShowDaysInListSetting === "true");

    const isShowStatsInListSetting = await AsyncStorage.getItem("isShowStatsInList");
    setShowStatsInList(isShowStatsInListSetting === "true");
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchSettings();
      fetchRoutines();
      setIsLoading(false);
    }, []),
  );

  const createNewRoutine = async () => {
    const newRoutine = {
      ...getRoutineStructure(),
      name: "New Routine",
    };

    await addRoutine(newRoutine);
    navigation.navigate("EditRoutine", { routineId: newRoutine.id });
  };

  const headerLeft = () => (
    <View style={styles.headerLeftContainer}>
      <Text style={[styles.text, styles.headerTitle]}>Routines</Text>
    </View>
  );

  const headerRight = () => (
    <View style={styles.headerRightContainer}>
      <HeaderButton icon="plus" text="New" onPress={createNewRoutine} />
    </View>
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: "", headerLeft, headerRight });
  }, [navigation, isDarkMode, routines, isShowDaysInList, isShowStatsInList]);

  const editRoutine = (routineId) => {
    navigation.navigate("EditRoutine", { routineId });
  };

  const renderRoutine = ({ item }) => {
    const selectedDays = item.days;

    return (
      <TouchableOpacity style={styles.routineContainer} onPress={() => editRoutine(item.id)}>
        {isShowDaysInList && (
          <View style={styles.routineContainerTop}>
            <View style={styles.routineContainerLeft}>
              <View style={[styles.smallDaysContainer, item.enabled ? null : styles.disabled]}>
                {Object.keys(selectedDays).map((day) => (
                  <View key={day} style={[styles.smallDayButton, selectedDays[day] ? styles.dayButtonSelected : null]}>
                    <Text style={[styles.smallDayButtonText, selectedDays[day] ? styles.dayButtonTextSelected : null]}>{day[0].toUpperCase()}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Text style={[styles.text, styles.routineBubbleText, item.enabled ? null : styles.disabled]}>{`${item.hour}:${item.minute}`}</Text>
          </View>
        )}
        <View style={styles.routineNameContainer}>
          <Text style={[styles.text, styles.routineTitle]} numberOfLines={3} ellipsizeMode="tail">{item.name}</Text>
          {!isShowDaysInList && (
            <Text style={[styles.text, styles.routineBubbleText, item.enabled ? null : styles.disabled]}>{`${item.hour}:${item.minute}`}</Text>
          )}
        </View>
        {isShowStatsInList && (
          <RoutineStats routineId={item.id} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <FlatList
          data={routines}
          renderItem={renderRoutine}
          keyExtractor={(item) => item.id}
        />

        <RoutineInProgressBar navigation={navigation} />

        {routines.length === 0 && (
          <View style={styles.emptyRoutineContainer}>
            <Text style={[styles.text, styles.emptyRoutineTitle]}>No routines yet!</Text>
            <Text style={[styles.text, styles.emptyRoutineText]}>Tap the + button to create one.</Text>
          </View>
        )}

      </View>
      {isLoading && <Loading />}
    </>
  );
}

RoutineListScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate   : PropTypes.func.isRequired,
    setOptions : PropTypes.func.isRequired,
  }).isRequired,
};

export default RoutineListScreen;
