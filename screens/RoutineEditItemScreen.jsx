import { FontAwesome5 } from "@expo/vector-icons";
import PropTypes from "prop-types";
import React, { useLayoutEffect, useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../ThemeContext";
import getStyles from "../styles";
import getColors from "../styles/colors";

import CircleDial from "../components/CircleDial";
import EmojiPicker from "../components/EmojiPicker";
import HeaderButton from "../components/HeaderButton";

import { addCustomRoutineTask, deleteRoutineItem, updateRoutineItem } from "../lib/routine";

function RoutineEditItemScreen({ route, navigation }) {
  const { isDarkMode } = useTheme();
  const styles         = getStyles({ isDarkMode });
  const colors         = getColors({ isDarkMode });

  const { routineId, item, isCustom } = route.params;

  const [itemName, setItemName]       = useState(item.name);
  const [itemAvgTime, setItemAvgTime] = useState(item.avgTime);
  const [itemEmoji, setItemEmoji]     = useState(item.emoji);

  const cancel = () => {
    navigation.goBack();
  };

  const save = async () => {
    const updatedItem = {
      ...item,
      name    : itemName,
      avgTime : itemAvgTime,
      emoji   : itemEmoji,
    };

    if (isCustom) {
      await addCustomRoutineTask(updatedItem);
    }

    await updateRoutineItem(routineId, updatedItem);
    navigation.navigate("EditRoutine", { routineId });
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
  }, [navigation, isDarkMode, itemName, itemAvgTime, itemEmoji]);

  const deleteRoutineAndBack = async () => {
    await deleteRoutineItem(routineId, item.id);
    navigation.goBack();
  };

  const confirmDelete = () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteRoutineAndBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <EmojiPicker
        title={itemName}
        value={itemEmoji}
        onSelect={(selectedEmoji) => setItemEmoji(selectedEmoji)}
      />

      <TextInput
        style={[styles.text, styles.input]}
        placeholder="Task Name"
        value={itemName !== "New Task" ? itemName : ""}
        onChangeText={setItemName}
        placeholderTextColor={colors.mediumOpacity}
        multiline
      />

      <View style={styles.dialContainer}>
        <CircleDial
          title="Average Time"
          value={itemAvgTime}
          unit="min"
          max={60}
          onChange={setItemAvgTime}
        />
      </View>

      {!isCustom && (
        <>
          <View style={styles.spacer} />
          <View style={styles.bottomButtonContainer}>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={confirmDelete}>
              <FontAwesome5 style={styles.buttonIcon} name="trash-alt" size={20} color={colors.delete} />
              <Text style={[styles.text, styles.deleteButtonText]}>Delete Task</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

RoutineEditItemScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      routineId : PropTypes.string.isRequired,
      item      : PropTypes.shape({
        id      : PropTypes.string.isRequired,
        name    : PropTypes.string.isRequired,
        emoji   : PropTypes.string.isRequired,
        avgTime : PropTypes.number.isRequired,
      }).isRequired,
      isCustom: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    goBack     : PropTypes.func.isRequired,
    setOptions : PropTypes.func.isRequired,
    navigate   : PropTypes.func.isRequired,
  }).isRequired,
};

export default RoutineEditItemScreen;
