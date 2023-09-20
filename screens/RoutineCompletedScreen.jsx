import { FontAwesome5 } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import PropTypes from "prop-types";
import React, { useLayoutEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useTheme } from "../ThemeContext";
import getStyles from "../styles";
import getColors from "../styles/colors";

import HeaderButton from "../components/HeaderButton";

import { clearAllNotifications } from "../lib/notifications";

function RoutineCompletedScreen({ route, navigation }) {
  const { isDarkMode } = useTheme();
  const styles         = getStyles({ isDarkMode });
  const colors         = getColors({ isDarkMode });

  const { routineId, routineName } = route.params;

  const back = async () => {
    navigation.navigate("RoutineList");
    await clearAllNotifications();
  };

  const openSuggestions = async () => {
    navigation.navigate("RoutineSuggestions", { routineId, routineName });
    await clearAllNotifications();
  };

  const headerLeft = () => (
    <View style={styles.headerLeftContainer}>
      <HeaderButton icon="check" text="Finish" onPress={back} />
    </View>
  );

  useLayoutEffect(() => { navigation.setOptions({ title: "", headerLeft }); }, [navigation, isDarkMode]);

  const completeVideo = isDarkMode
    ? require("../assets/videos/confetti-black.mp4")
    : require("../assets/videos/confetti-white.mp4");

  return (
    <View style={styles.container}>
      <Video
        style={styles.completeVideo}
        source={completeVideo}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay
      />

      <View style={styles.routineHeader}>
        <Text style={[styles.text, styles.title]}>{routineName}</Text>
      </View>

      <View style={styles.spacer} />

      <View style={styles.routineCurrentItemContainer}>
        <FontAwesome5 name="trophy" size={100} color={colors.text} />
        <Text style={[styles.text, styles.title]}>Finished!</Text>
      </View>

      <View style={styles.spacer} />

      {/* <View style={styles.suggestionsButtonContainer}>
        <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={openSuggestions}>
          <FontAwesome5 style={styles.buttonIcon} name="lightbulb" size={20} color={colors.text} />
          <Text style={[styles.text, styles.buttonOutlineText]}>Suggestions</Text>
        </TouchableOpacity>
      </View> */}

      <View style={styles.completeButtonContainer}>
        <TouchableOpacity style={[styles.button, styles.completeButton]} onPress={back}>
          <FontAwesome5 style={styles.buttonIcon} name="check" size={20} color={colors.background} />
          <Text style={[styles.text, styles.buttonText]}>Complete Routine</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

RoutineCompletedScreen.propTypes = {
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

export default RoutineCompletedScreen;
