import PropTypes from "prop-types";
import { Picker } from "@react-native-picker/picker";
import {
  View, Text, TextInput, TouchableOpacity, Alert, Switch, ScrollView,
} from "react-native";
import React, { useState, useLayoutEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "../ThemeContext";
import getStyles from "../styles";

import HeaderButton from "../components/HeaderButton";
import Loading from "../components/Loading";
import RoutineInProgressBar from "../components/RoutineInProgressBar";
import RoutineItem from "../components/RoutineItem";

import { deleteRoutine, getRoutineStructure, updateRoutine } from "../lib/routine";
import getColors from "../styles/colors";

function RoutineEditScreen({ route, navigation }) {
  const { isDarkMode } = useTheme();
  const styles         = getStyles({ isDarkMode });
  const colors         = getColors({ isDarkMode });

  const { routineId } = route.params;

  const [isLoading, setIsLoading] = useState(true);
  const [routine, setRoutine]     = useState(getRoutineStructure());
  const [isDirty, setIsDirty]     = useState(false);

  const fetchRoutine = async () => {
    const storedRoutines = await AsyncStorage.getItem("routines");
    if (storedRoutines) {
      const routines     = JSON.parse(storedRoutines);
      const foundRoutine = routines.find((r) => r.id === routineId);
      if (foundRoutine) {
        setRoutine(foundRoutine);
      }
    }

    setIsLoading(false);
  };

  useFocusEffect(React.useCallback(() => { fetchRoutine(); }, []));

  const cancel = () => {
    navigation.goBack();
  };

  const save = async () => {
    await updateRoutine(routine);
    navigation.goBack();
  };

  const toggleDay = (day) => {
    const newSelectedDays = { ...routine.days };
    newSelectedDays[day]  = !newSelectedDays[day];

    setRoutine({ ...routine, days: newSelectedDays });
    setIsDirty(true);
  };

  const addRoutineItem = () => {
    if (isDirty) {
      Alert.alert("Save Changes", "You have unsaved changes. Would you like to save them?", [
        { text: "Cancel", style: "cancel" },
        {
          text    : "Save",
          onPress : async () => {
            await updateRoutine(routine);
            await setIsDirty(false);
            navigation.navigate("AddRoutineItem", { routineId });
          },
        },
      ]);
    } else {
      navigation.navigate("AddRoutineItem", { routineId });
    }
  };

  const moveRoutineItemUp = (itemId) => {
    const itemIndex = routine.items.findIndex((current) => current.id === itemId);
    if (itemIndex > 0) {
      const newItems          = [...routine.items];
      const temp              = newItems[itemIndex - 1];
      newItems[itemIndex - 1] = newItems[itemIndex];
      newItems[itemIndex]     = temp;

      setRoutine({ ...routine, items: newItems });
      setIsDirty(true);
    }
  };

  const editRoutineItem = (itemId) => {
    const item = routine.items.find((current) => current.id === itemId);

    if (isDirty) {
      Alert.alert("Save Changes", "You have unsaved changes. Would you like to save them?", [
        { text: "Cancel", style: "cancel" },
        {
          text    : "Save",
          onPress : async () => {
            await updateRoutine(routine);
            await setIsDirty(false);
            navigation.navigate("EditRoutineItem", { routineId, item, isCustom: false });
          },
        },
      ]);
    } else {
      navigation.navigate("EditRoutineItem", { routineId, item, isCustom: false });
    }
  };

  const deleteRoutineAndBack = async () => {
    await deleteRoutine(routineId);
    navigation.goBack();
  };

  const confirmDelete = () => {
    Alert.alert("Delete Routine", "Are you sure you want to delete this routine?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteRoutineAndBack() },
    ]);
  };

  const start = () => {
    if (isDirty) {
      Alert.alert("Save Changes", "You have unsaved changes. Would you like to save them?", [
        { text: "Cancel", style: "cancel" },
        {
          text    : "Save",
          onPress : async () => {
            await updateRoutine(routine);
            await setIsDirty(false);
            navigation.navigate("RoutineStart", { routineId });
          },
        },
      ]);
    } else {
      navigation.navigate("RoutineStart", { routineId });
    }
  };

  const updateName = (value) => {
    setRoutine({ ...routine, name: value });
    setIsDirty(true);
  };

  const updateEnabled = (value) => {
    setRoutine({ ...routine, enabled: value });
    setIsDirty(true);
  };

  const updateHour = (value) => {
    setRoutine({ ...routine, hour: value });
    setIsDirty(true);
  };

  const updateMinute = (value) => {
    setRoutine({ ...routine, minute: value });
    setIsDirty(true);
  };

  const headerLeft = () => (
    <View style={styles.headerLeftContainer}>
      <HeaderButton icon="times" text="Cancel" onPress={cancel} />
    </View>
  );

  const headerRight = () => (
    <View style={styles.headerRightContainer}>
      <HeaderButton icon="save" text="Save" onPress={save} />
    </View>
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: "", headerLeft, headerRight });
  }, [navigation, isDarkMode, routine]);

  const openRoutineButton = (
    <View style={routine.enabled ? null : styles.disabled}>
      <TouchableOpacity style={styles.button} onPress={start} disabled={!routine.enabled}>
        <FontAwesome5 style={styles.buttonIcon} name="arrow-alt-circle-right" size={20} color={colors.background} />
        <Text style={[styles.text, styles.buttonText]}>Open Routine</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
        <TextInput
          style={[styles.text, styles.input]}
          placeholder="New Routine"
          value={routine.name !== "New Routine" ? routine.name : ""}
          onChangeText={updateName}
          placeholderTextColor={colors.mediumOpacity}
          multiline
        />

        <View style={styles.switchContainer}>
          <Text style={[styles.text, styles.label]}>Enable Routine</Text>
          <Switch
            value={routine.enabled}
            onValueChange={updateEnabled}
            trackColor={{
              false : colors.mediumOpacity,
              true  : colors.text,
            }}
            thumbColor={colors.text}
          />
        </View>

        <View style={[styles.row, routine.enabled ? null : styles.disabled]}>
          <Text style={[styles.text, styles.label]}>Time Start</Text>
          <View style={styles.timePickerContainer}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={routine.hour}
                style={styles.picker}
                onValueChange={updateHour}
                enabled={routine.enabled}
              >
                {
                  Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map((item) => (
                    <Picker.Item key={item} label={item} value={item} />
                  ))
                }
              </Picker>
              <Text style={[styles.text, styles.pickerValue]}>{routine.hour}</Text>
            </View>
            <Text style={[styles.text, styles.pickerValue]}>:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={routine.minute}
                style={styles.picker}
                onValueChange={updateMinute}
                enabled={routine.enabled}
              >
                {
                  Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0")).map((item) => (
                    <Picker.Item key={item} label={item} value={item} />
                  ))
                }
              </Picker>
              <Text style={[styles.text, styles.pickerValue]}>{routine.minute}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.daysContainer, routine.enabled ? null : styles.disabled]}>
          {Object.keys(routine.days).map((day) => (
            <TouchableOpacity
              key={day}
              style={[styles.dayButton, routine.days[day] ? styles.dayButtonSelected : null]}
              onPress={() => toggleDay(day)}
              disabled={!routine.enabled}
            >
              <Text style={[styles.dayButtonText, routine.days[day] ? styles.dayButtonTextSelected : null]}>{day[0].toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.routineItemsContainer, routine.enabled ? null : styles.disabled]}>
          {routine.items.map((item) => (
            <View style={styles.routineEditItemContainer} key={item.id}>
              <TouchableOpacity style={styles.buttonIconOnly} onPress={() => moveRoutineItemUp(item.id)} disabled={!routine.enabled}>
                <FontAwesome5 name="arrow-alt-circle-up" size={20} color={colors.highOpacity} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.routineEditItemContainerRight} onPress={() => editRoutineItem(item.id)} disabled={!routine.enabled}>
                <RoutineItem item={item} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.spacer} />

        <View style={[routine.enabled ? null : styles.disabled]}>
          <TouchableOpacity style={styles.buttonOutline} onPress={addRoutineItem} disabled={!routine.enabled}>
            <FontAwesome5 style={styles.buttonOutlineIcon} name="plus" size={20} color={colors.text} />
            <Text style={[styles.text, styles.buttonOutlineText]}>Add Task</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.paddingContainer}>
          <RoutineInProgressBar navigation={navigation} fallbackComponent={openRoutineButton} />
        </View>

        <View style={styles.deleteButtonContainer}>
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={confirmDelete}>
            <FontAwesome5 style={styles.buttonIcon} name="trash-alt" size={20} color={colors.delete} />
            <Text style={[styles.text, styles.deleteButtonText]}>Delete Routine</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {isLoading && <Loading />}
    </>
  );
}

RoutineEditScreen.propTypes = {
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

export default RoutineEditScreen;
