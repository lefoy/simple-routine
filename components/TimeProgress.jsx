import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

import getStyles from "../styles";

function TimeProgress({ item, isDarkMode }) {
  const styles = getStyles({ isDarkMode });

  const { timeStarted, avgTime }      = item;
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progress, setProgress]       = useState(0);

  useEffect(() => {
    const update = () => {
      if (!timeStarted) {
        return;
      }

      const currentTime     = new Date();
      const time            = (currentTime - new Date(timeStarted)) / 1000;
      const progressPercent = (time / (avgTime * 60)) * 100;

      setElapsedTime(time);
      setProgress(progressPercent > 100 ? 100 : progressPercent);
    };

    update();

    // Create a timer that updates every second
    const timer = setInterval(update, 1000);

    // Clear the timer when the component is unmounted
    return () => clearInterval(timer);
  }, [timeStarted, avgTime]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBar}>
        <View style={styles.progressBarBackground} />
        <View style={[styles.progressBarProgress, { width: `${progress}%` }]} />
      </View>
      <View style={styles.progressBarTextContainer}>
        <Text style={styles.progressBarText}>
          {elapsedTime !== null ? formatTime(elapsedTime) : "Calculating..."}
        </Text>
        <Text style={styles.progressBarText}>{formatTime(avgTime * 60)}</Text>
      </View>
    </View>
  );
}

TimeProgress.propTypes = {
  item: PropTypes.shape({
    timeStarted : PropTypes.number,
    avgTime     : PropTypes.number.isRequired,
  }).isRequired,
  isDarkMode: PropTypes.bool.isRequired,
};

export default TimeProgress;
