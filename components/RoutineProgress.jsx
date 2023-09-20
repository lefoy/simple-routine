import { FontAwesome5 } from "@expo/vector-icons";
import PropTypes from "prop-types";
import React from "react";
import { View } from "react-native";

import getStyles from "../styles";
import getColors from "../styles/colors";

function RoutineProgress({ items, currentIndex, isDarkMode }) {
  const styles = getStyles({ isDarkMode });
  const colors = getColors({ isDarkMode });

  const totalItems = items.length;

  const maxIconsToDisplay = 5;
  const middleIcon        = Math.floor(maxIconsToDisplay / 2);

  let progress = 0;

  if (totalItems <= maxIconsToDisplay) {
    progress = (currentIndex / (totalItems - 1)) * 100;
  } else if (currentIndex === 0) {
    progress = 0;
  } else if (currentIndex === totalItems - 1) {
    progress = 100;
  } else if (currentIndex >= middleIcon && currentIndex < totalItems - middleIcon) {
    progress = 50;
  } else {
    let relativeIndex = currentIndex;
    if (currentIndex < middleIcon) {
      relativeIndex = currentIndex;
    } else if (currentIndex >= totalItems - middleIcon) {
      relativeIndex = currentIndex - (totalItems - maxIconsToDisplay);
    }
    progress = (relativeIndex / (maxIconsToDisplay - 1)) * 100;
  }

  let start = Math.max(0, currentIndex - middleIcon);
  const end = Math.min(totalItems, start + maxIconsToDisplay);

  if (end === totalItems) {
    start = Math.max(0, end - maxIconsToDisplay);
  }

  const displayItems = items.slice(start, end);

  const getIconColor = (index) => {
    let iconColor = colors.text;
    if (index + start > currentIndex) iconColor = colors.mediumOpacity;
    return iconColor;
  };

  return (
    <View style={styles.routineProgressBarContainer}>
      <View style={styles.routineProgressBar}>
        <View style={styles.routineProgressBarBackground} />
        <View style={[styles.routineProgressBarProgress, { width: `${progress}%` }]} />
      </View>
      <View style={styles.routineProgressBarIcons}>
        {displayItems.map((item, index) => (
          <FontAwesome5
            key={`${item.emoji}-${item.avgTime}-${item.id}`}
            style={styles.routineProgressBarIcon}
            name={item.emoji}
            size={24}
            color={getIconColor(index)}
          />
        ))}
      </View>
    </View>
  );
}

RoutineProgress.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    emoji: PropTypes.string.isRequired,
  })).isRequired,
  currentIndex : PropTypes.number.isRequired,
  isDarkMode   : PropTypes.bool.isRequired,
};

export default RoutineProgress;
