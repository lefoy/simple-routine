import { FontAwesome5 } from "@expo/vector-icons";
import PropTypes from "prop-types";
import React from "react";
import { Text, View } from "react-native";

import { useTheme } from "../ThemeContext";
import getStyles from "../styles";
import getColors from "../styles/colors";

function RoutineItem({ item, showEmoji = true }) {
  const { isDarkMode } = useTheme();
  const styles         = getStyles({ isDarkMode });
  const colors         = getColors({ isDarkMode });

  return (
    <View style={styles.routineItemContainer}>
      <View style={styles.routineItemContainerLeft}>
        {showEmoji && (
          <FontAwesome5
            name={item.emoji}
            size={24}
            color={colors.text}
            style={styles.routineItemIcon}
          />
        )}
        <Text style={[styles.text, styles.routineItemTitle]}>{item.name}</Text>
      </View>
      <Text style={[styles.text, styles.routineItemBubbleText]}>{`${item.avgTime} min`}</Text>
    </View>
  );
}

RoutineItem.propTypes = {
  item: PropTypes.shape({
    id      : PropTypes.string.isRequired,
    emoji   : PropTypes.string.isRequired,
    name    : PropTypes.string.isRequired,
    avgTime : PropTypes.number.isRequired,
  }).isRequired,
  showEmoji: PropTypes.bool,
};

RoutineItem.defaultProps = {
  showEmoji: true,
};

export default RoutineItem;
