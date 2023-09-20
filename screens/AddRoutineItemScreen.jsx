import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PropTypes from "prop-types";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../ThemeContext";
import getStyles from "../styles";
import getColors from "../styles/colors";

import HeaderButton from "../components/HeaderButton";
import Loading from "../components/Loading";
import RoutineItem from "../components/RoutineItem";

import { getRoutineItemStructure, updateRoutineItem } from "../lib/routine";

function AddRoutineItemScreen({ route, navigation }) {
  const { isDarkMode } = useTheme();
  const styles         = getStyles({ isDarkMode });
  const colors         = getColors({ isDarkMode });

  const [tasks, setTasks]                 = useState({ default: [], custom: [] });
  const [searchText, setSearchText]       = useState("");
  const [filteredTasks, setFilteredTasks] = useState({ default: [], custom: [] });

  const { routineId } = route.params;

  useEffect(() => {
    const fetchTasks = async () => {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        const tasksObject = JSON.parse(storedTasks);
        setTasks(tasksObject);
        setFilteredTasks(tasksObject);
      }
    };

    fetchTasks();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    const filterTaskList = (taskList) => taskList.filter((task) => task.name.toLowerCase().includes(text.toLowerCase()));
    const filtered       = {
      default : filterTaskList(tasks.default),
      custom  : filterTaskList(tasks.custom),
    };
    setFilteredTasks(filtered);
  };

  const cancel = () => {
    navigation.goBack();
  };

  const addCustomItem = () => {
    const newItem = {
      ...getRoutineItemStructure(),
      name: "New Task",
    };

    navigation.navigate("EditRoutineItem", { routineId, item: newItem, isCustom: true });
  };

  const addTaskToRoutine = async (task) => {
    const item = {
      ...getRoutineItemStructure(),
      name    : task.name,
      emoji   : task.emoji,
      avgTime : task.avgTime,
    };

    await updateRoutineItem(routineId, item);
    navigation.goBack();
  };

  const deleteCustomTask = async (taskId) => {
    const newTasks = tasks.custom.filter((task) => task.id !== taskId);
    await AsyncStorage.setItem("tasks", JSON.stringify({ ...tasks, custom: newTasks }));
    setTasks({ ...tasks, custom: newTasks });
  };

  const confirmDeleteCustomTask = (taskId) => {
    Alert.alert(
      "Delete Custom Task",
      "Are you sure you want to delete this custom task?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteCustomTask(taskId) },
      ],
    );
  };

  const headerLeft = () => (
    <View style={styles.headerLeftContainer}>
      <HeaderButton icon="times" text="Cancel" onPress={cancel} />
    </View>
  );

  const headerRight = () => (
    <View style={styles.headerRightContainer}>
      <HeaderButton icon="plus" text="Add Custom" onPress={addCustomItem} />
    </View>
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: "", headerLeft, headerRight });
  }, [navigation, isDarkMode]);

  if (tasks.default.length === 0) {
    return <Loading />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
      <TextInput
        style={[styles.text, styles.input]}
        value={searchText}
        onChangeText={handleSearch}
        placeholder="Search task..."
        placeholderTextColor={colors.mediumOpacity}
      />
      {filteredTasks.custom.length > 0 && (
        <View style={styles.routineItemsSectionContainer}>
          {filteredTasks.custom.map((item) => (
            <View style={styles.routineAddItemContainer} key={`${item.emoji}-${item.avgTime}-${item.id}`}>
              <TouchableOpacity style={styles.routineAddItemContainerLeft} onPress={() => addTaskToRoutine(item)}>
                <RoutineItem item={item} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.buttonIconOnly, styles.routineDeleteCustomItemButton]} onPress={() => confirmDeleteCustomTask(item.id)}>
                <FontAwesome5 name="trash-alt" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={styles.routineItemsSectionContainer}>
        {filteredTasks.default.map((item) => (
          <View style={styles.routineAddItemContainer} key={`${item.emoji}-${item.avgTime}-${item.id}`}>
            <TouchableOpacity style={styles.routineAddItemContainerLeft} onPress={() => addTaskToRoutine(item)}>
              <RoutineItem item={item} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

AddRoutineItemScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      routineId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    goBack     : PropTypes.func.isRequired,
    setOptions : PropTypes.func.isRequired,
    navigate   : PropTypes.func.isRequired,
  }).isRequired,
};

export default AddRoutineItemScreen;
