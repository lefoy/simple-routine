import PropTypes from "prop-types";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import { useTheme } from "../ThemeContext";
import getStyles from "../styles";
import getColors from "../styles/colors";

function HeaderButton({
  icon, text, onPress, disabled,
}) {
  const { isDarkMode } = useTheme();
  const styles         = getStyles({ isDarkMode });
  const colors         = getColors({ isDarkMode });

  return (
    <TouchableOpacity onPress={onPress} style={styles.headerButton} disabled={disabled}>
      <FontAwesome5 name={icon} size={16} color={colors.text} />
      <Text style={[styles.text, styles.headerButtonText]}>{text}</Text>
    </TouchableOpacity>
  );
}

HeaderButton.propTypes = {
  icon     : PropTypes.string.isRequired,
  text     : PropTypes.string.isRequired,
  onPress  : PropTypes.func.isRequired,
  disabled : PropTypes.bool,
};

HeaderButton.defaultProps = {
  disabled: false,
};

export default HeaderButton;
