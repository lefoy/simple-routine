import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import PropTypes from "prop-types";
import React, { useLayoutEffect, useMemo, useState } from "react";
import {
  Alert,
  Switch,
  Text, TextInput, TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";

import { useTheme } from "../ThemeContext";
import getStyles from "../styles";
import getColors from "../styles/colors";

import HeaderButton from "../components/HeaderButton";
import Loading from "../components/Loading";
import RoutineInProgressBar from "../components/RoutineInProgressBar";
import RoutineItem from "../components/RoutineItem";

import { deleteRoutine, getRoutineStructure, updateRoutine } from "../lib/routine";

function RoutineEditScreen({ route, navigation }) {
  const { isDarkMode } = useTheme();
  const styles         = getStyles({ isDarkMode });
  const colors         = getColors({ isDarkMode });

  const { routineId } = route.params;

  const [isLoading, setIsLoading]                       = useState(true);
  const [routine, setRoutine]                           = useState(getRoutineStructure());
  const [selectedRoutineItemId, setSelectedRoutineItem] = useState(null);
  const [isDeleteMode, setIsDeleteMode]                 = useState(false);
  const [isDirty, setIsDirty]                           = useState(false);

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

  const handleExitDeleteMode = () => {
    setIsDeleteMode(false);
    setSelectedRoutineItem(null);
  };

  const saveRoutine = async () => {
    delete routine.new;

    if (routine.name === "") {
      routine.name = "New Routine";
    }

    await updateRoutine(routine);
    await setIsDirty(false);
  };

  const confirmDirty = (onPress) => {
    if (isDirty) {
      Alert.alert("Save Changes", "You have unsaved changes. Would you like to save them?", [
        { text: "Cancel", style: "cancel", onPress },
        {
          text    : "Save",
          onPress : async () => {
            await saveRoutine();
            onPress();
          },
        },
      ]);
    } else {
      onPress();
    }
  };

  const deleteRoutineAndBack = async () => {
    await deleteRoutine(routineId);
    navigation.goBack();
  };

  useFocusEffect(React.useCallback(() => {
    fetchRoutine();
    return () => {
      handleExitDeleteMode();

      if (routine.new) {
        deleteRoutine(routineId);
      }
    };
  }, []));

  const cancel = () => {
    confirmDirty(() => {
      if (routine.new) {
        deleteRoutineAndBack();
        return;
      }

      navigation.goBack();
    });
  };

  const save = async () => {
    await saveRoutine();
    navigation.goBack();
  };

  const toggleDay = (day) => {
    const newSelectedDays = { ...routine.days };
    newSelectedDays[day]  = !newSelectedDays[day];

    setRoutine({ ...routine, days: newSelectedDays });
    setIsDirty(true);
  };

  const addRoutineItem = () => {
    confirmDirty(() => { navigation.navigate("AddRoutineItem", { routineId }); });
  };

  const editRoutineItem = (itemId) => {
    const item = routine.items.find((current) => current.id === itemId);

    confirmDirty(() => { navigation.navigate("EditRoutineItem", { routineId, item, isCustom: false }); });
  };

  const deleteItem = () => {
    const newItems = routine.items.filter((item) => item.id !== selectedRoutineItemId);
    setRoutine({ ...routine, items: newItems });
    setIsDeleteMode(false);
    setSelectedRoutineItem(null);
  };

  const confirmDelete = () => {
    Alert.alert("Delete Routine", "Are you sure you want to delete this routine?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteRoutineAndBack() },
    ]);
  };

  const confirmDeleteItem = () => {
    Alert.alert("Delete Routine", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteItem() },
    ]);
  };

  const handlePress = (routineItemId) => {
    if (isDeleteMode) {
      setIsDeleteMode(false);
      setSelectedRoutineItem(null);
      return;
    }

    editRoutineItem(routineItemId);
  };

  const start = () => {
    confirmDirty(() => { navigation.navigate("RoutineStart", { routineId }); });
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

  const updateRoutineItemsOrder = (newItems) => {
    const hasChanged = JSON.stringify(routine.items) !== JSON.stringify(newItems);

    if (hasChanged) {
      setRoutine({ ...routine, items: newItems });
      setIsDirty(true);
    }
  };

  const headerLeft = () => (
    <View style={styles.headerLeftContainer}>
      {isDeleteMode ? (
        <HeaderButton icon="times" text="Cancel" onPress={handleExitDeleteMode} />
      ) : (
        <HeaderButton icon="times" text="Cancel" onPress={cancel} />
      )}
    </View>
  );

  const headerRight = () => (
    <View style={styles.headerRightContainer}>
      {isDeleteMode ? (
        <HeaderButton icon="trash" text="Delete" color={colors.delete} onPress={confirmDeleteItem} />
      ) : (
        <HeaderButton icon="save" text="Save" onPress={save} />
      )}
    </View>
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: "", headerLeft, headerRight });
  }, [navigation, isDarkMode, routine, isDeleteMode, selectedRoutineItemId]);

  const openRoutineButton = (
    <View style={routine.enabled ? null : styles.disabled}>
      <TouchableOpacity style={styles.button} onPress={start} disabled={!routine.enabled}>
        <FontAwesome5 style={styles.buttonIcon} name="arrow-alt-circle-right" size={20} color={colors.background} />
        <Text style={[styles.text, styles.buttonText]}>Open Routine</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = useMemo(() => (
    <>
      <TextInput
        style={[styles.text, styles.input]}
        placeholder="New Routine"
        value={routine.name}
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
        {Object.keys(routine.days).map((day, index) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              routine.days[day] ? styles.dayButtonSelected : null,
              index === 0 ? styles.dayButtonFirst : null,
            ]}
            onPress={() => toggleDay(day)}
            disabled={!routine.enabled}
          >
            <Text style={[styles.dayButtonText, routine.days[day] ? styles.dayButtonTextSelected : null]}>{day[0].toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  ), [routine, colors]);

  const renderFooter = () => (
    <>
      <View style={[routine.enabled ? null : styles.disabled]}>
        <TouchableOpacity style={styles.buttonOutline} onPress={addRoutineItem} disabled={!routine.enabled}>
          <FontAwesome5 style={styles.buttonOutlineIcon} name="plus" size={20} color={colors.text} />
          <Text style={[styles.text, styles.buttonOutlineText]}>Add Task</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.paddingContainer}>
        <View style={styles.deleteButtonContainer}>
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={confirmDelete}>
            <FontAwesome5 style={styles.buttonIcon} name="trash-alt" size={20} color={colors.delete} />
            <Text style={[styles.text, styles.deleteButtonText]}>Delete Routine</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const renderEmptyComponent = () => (
    <View style={[styles.emptyContainer, routine.enabled ? null : styles.disabled]}>
      <Text style={[styles.text, styles.emptyRoutineTitle]}>No Task Yet!</Text>
      <Text style={[styles.text, styles.emptyRoutineText]}>{"Tap the + Add Task button\nbelow to create one."}</Text>
    </View>
  );

  const renderItem = ({ item, drag }) => {
    const startDrag = () => {
      Vibration.vibrate(50);
      drag();
    };

    return (
      <TouchableOpacity
        style={[styles.routineEditItemContainer, routine.enabled ? null : styles.disabled]}
        onPress={() => handlePress(item.id)}
        onLongPress={startDrag}
        disabled={!routine.enabled}
      >
        <RoutineItem item={item} />
      </TouchableOpacity>
    ); };

  return (
    <>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <DraggableFlatList
            data={routine.items}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            ListFooterComponentStyle={styles.listFooter}
            ListEmptyComponent={renderEmptyComponent}
            keyExtractor={(item) => `draggable-item-${item.id}`}
            onDragEnd={({ data }) => updateRoutineItemsOrder(data)}
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContentContainer}
          />
        </View>
        <View style={styles.spacer} />
        <View style={{ flex: 0 }}>
          <RoutineInProgressBar navigation={navigation} fallbackComponent={openRoutineButton} />
        </View>
      </View>
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
