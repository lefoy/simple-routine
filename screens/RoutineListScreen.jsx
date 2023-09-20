import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import PropTypes from "prop-types";
import React, { useLayoutEffect, useState } from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";

import { SplashScreen } from "expo-router";
import { useTheme } from "../ThemeContext";
import getStyles from "../styles";
import getColors from "../styles/colors";

import HeaderButton from "../components/HeaderButton";
import Loading from "../components/Loading";
import RoutineInProgressBar from "../components/RoutineInProgressBar";
import RoutineStats from "../components/RoutineStats";

import { addRoutine, deleteRoutine, getRoutineStructure } from "../lib/routine";

function RoutineListScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const styles         = getStyles({ isDarkMode });
  const colors         = getColors({ isDarkMode });

  const [isLoading, setIsLoading]               = useState(true);
  const [routines, setRoutines]                 = useState([]);
  const [selectedRoutineId, setSelectedRoutine] = useState(null);
  const [isDeleteMode, setIsDeleteMode]         = useState(false);
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

  const handleExitDeleteMode = () => {
    setIsDeleteMode(false);
    setSelectedRoutine(null);
  };

  useFocusEffect(
    React.useCallback(() => {
      Promise.all([fetchSettings(), fetchRoutines()]).then(() => {
        setIsLoading(false);
        SplashScreen.hideAsync();
      });

      // Reset the delete mode when leaving the screen
      return () => handleExitDeleteMode();
    }, []),
  );

  const updateRoutinesOrder = (newData) => {
    const hasChanged = JSON.stringify(routines) !== JSON.stringify(newData);

    if (hasChanged) {
      setRoutines(newData);
      AsyncStorage.setItem("routines", JSON.stringify(newData));
      setIsDeleteMode(false);
    }
  };

  const createNewRoutine = async () => {
    const newRoutine = {
      ...getRoutineStructure(),
      new: true,
    };

    await addRoutine(newRoutine);
    navigation.navigate("EditRoutine", { routineId: newRoutine.id });
  };

  const deleteSelectedRoutine = async () => {
    await deleteRoutine(selectedRoutineId);
    setIsDeleteMode(false);
    setSelectedRoutine(null);
    fetchRoutines();
  };

  const confirmDelete = () => {
    Alert.alert("Delete Routine", "Are you sure you want to delete this routine?", [
      { text: "Cancel", style: "cancel", onPress: () => handleExitDeleteMode() },
      { text: "Delete", style: "destructive", onPress: () => deleteSelectedRoutine() },
    ]);
  };

  const headerLeft = () => (
    <View style={styles.headerLeftContainer}>
      {isDeleteMode ? (
        <HeaderButton icon="times" text="Cancel" onPress={handleExitDeleteMode} />
      ) : (
        <Text style={[styles.text, styles.headerTitle]}>Routines</Text>
      )}
    </View>
  );

  const headerRight = () => (
    <View style={styles.headerRightContainer}>
      {isDeleteMode ? (
        <HeaderButton icon="trash" text="Delete" color={colors.delete} onPress={confirmDelete} />
      ) : (
        <HeaderButton icon="plus" text="New" onPress={createNewRoutine} />
      )}
    </View>
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: "", headerLeft, headerRight });
  }, [navigation, isDarkMode, routines, isShowDaysInList, isShowStatsInList, isDeleteMode, selectedRoutineId]);

  const handlePress = (routineId) => {
    if (isDeleteMode) {
      setIsDeleteMode(false);
      setSelectedRoutine(null);
      return;
    }

    navigation.navigate("EditRoutine", { routineId });
  };

  const renderRoutine = ({ item, drag }) => {
    const selectedDays = item.days;
    const startDrag    = () => {
      Vibration.vibrate(50);
      drag();
    };

    return (
      <TouchableOpacity
        style={styles.routineContainer}
        onPress={() => handlePress(item.id)}
        onLongPress={startDrag}
      >
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
          <Text style={[styles.text, styles.routineTitle, item.name === "" ? { opacity: 0.3 } : null]} numberOfLines={3} ellipsizeMode="tail">{item.name !== "" ? item.name : "New Routine"}</Text>
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
        <View style={{ flex: 1 }}>
          <DraggableFlatList
            data={routines}
            renderItem={renderRoutine}
            keyExtractor={(item) => `draggable-item-${item.id}`}
            onDragEnd={({ data }) => updateRoutinesOrder(data)}
          />

          {routines.length === 0 && (
            <View style={styles.emptyRoutineContainer}>
              <Text style={[styles.text, styles.emptyRoutineTitle]}>No Routines Yet!</Text>
              <Text style={[styles.text, styles.emptyRoutineText]}>Tap the + New button to create one.</Text>
            </View>
          )}
        </View>
        <View style={styles.spacer} />
        <View style={{ flex: 0 }}>
          <RoutineInProgressBar navigation={navigation} />
        </View>
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
