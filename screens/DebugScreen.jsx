import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import PropTypes from "prop-types";
import React, { useLayoutEffect, useState } from "react";
import {
  Alert, ScrollView, Text, View,
} from "react-native";

import { useTheme } from "../ThemeContext";
import getStyles from "../styles";

import Loading from "../components/Loading";

function DebugScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const styles         = getStyles({ isDarkMode });

  const [isLoading, setIsLoading] = useState(true);
  const [routines, setRoutines]   = useState([]);

  const fetchRoutines = async () => {
    try {
      const storedRoutines = await AsyncStorage.getItem("routines");
      if (storedRoutines) setRoutines(JSON.parse(storedRoutines));
      else setRoutines([]);
      setIsLoading(false);
    } catch (error) {
      Alert.alert("Error", "Could not load routines.");
      console.log(error);
    }
  };

  useFocusEffect(React.useCallback(() => { fetchRoutines(); }, []));

  const headerLeft = () => (
    <View style={styles.headerLeftContainer}>
      <Text style={[styles.text, styles.headerTitle]}>Debug</Text>
    </View>
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: "", headerLeft });
  }, [navigation, isDarkMode]);

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.paddingContainer}>
          <Text style={styles.text}>routines</Text>
          <Text style={styles.text}>{JSON.stringify(routines, null, 2)}</Text>
        </View>
      </ScrollView>
      {isLoading && <Loading />}
    </>
  );
}

DebugScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate   : PropTypes.func.isRequired,
    setOptions : PropTypes.func.isRequired,
  }).isRequired,
};

export default DebugScreen;
