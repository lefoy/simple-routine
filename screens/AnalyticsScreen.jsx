import PropTypes from "prop-types";
import React, { useState, useLayoutEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "../ThemeContext";
import getStyles from "../styles";
import Loading from "../components/Loading";

function AnalyticsScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const styles         = getStyles({ isDarkMode });

  // const [analyticsData, setAnalyticsData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading]     = useState(true);

  const headerLeft = () => (
    <View style={styles.headerLeftContainer}>
      <Text style={[styles.text, styles.headerTitle]}>Analytics</Text>
    </View>
  );

  const fetchData = async () => {
    // const storedAnalyticsData = await AsyncStorage.getItem("analytics");
    const storedHistoryData = await AsyncStorage.getItem("history");

    // if (storedAnalyticsData) {
    //   setAnalyticsData(JSON.parse(storedAnalyticsData));
    // } else {
    //   setAnalyticsData(null);
    // }
    if (storedHistoryData) {
      setHistoryData(JSON.parse(storedHistoryData));
    } else {
      setHistoryData(null);
    }

    setIsLoading(false);
  };

  useFocusEffect(React.useCallback(() => { fetchData(); }, []));

  useLayoutEffect(() => {
    navigation.setOptions({ title: "", headerLeft });
  }, [navigation, isDarkMode]);

  const completedRoutines = historyData ? Object.keys(historyData).length : 0;
  const completedItems    = historyData ? historyData.reduce((acc, current) => acc + current.items.filter((item) => item.completed).length, 0) : 0;
  const skippedItems      = historyData ? historyData.reduce((acc, current) => acc + current.items.filter((item) => item.skipped).length, 0) : 0;

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.statContainer}>
          <Text style={[styles.text, styles.label]}>Routines Completed</Text>
          <Text style={[styles.text, styles.statBubbleText]}>{completedRoutines}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.statContainer}>
          <Text style={[styles.text, styles.label]}>Tasks Completed</Text>
          <Text style={[styles.text, styles.statBubbleText]}>{completedItems}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.statContainer}>
          <Text style={[styles.text, styles.label]}>Tasks Skipped</Text>
          <Text style={[styles.text, styles.statBubbleText]}>{skippedItems}</Text>
        </View>

        <View style={styles.spacer} />

        <View style={styles.centerContainer}>
          <Text style={[styles.text, styles.label, styles.disabled]}>Dashboard coming soon!</Text>
        </View>
      </ScrollView>
      {isLoading && <Loading />}
    </>
  );
}

AnalyticsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate   : PropTypes.func.isRequired,
    setOptions : PropTypes.func.isRequired,
  }).isRequired,
};

export default AnalyticsScreen;
