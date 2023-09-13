import React, { useEffect } from "react";
import { View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Animated, {
  Easing, withRepeat, useSharedValue, useAnimatedStyle, withTiming,
} from "react-native-reanimated";

import { useTheme } from "../ThemeContext";
import getStyles from "../styles";
import getColors from "../styles/colors";

function Loading() {
  const { isDarkMode } = useTheme();
  const styles         = getStyles({ isDarkMode });
  const colors         = getColors({ isDarkMode });

  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 2000, easing: Easing.linear }), -1, false);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.loadingContainer}>
      <Animated.View style={animatedStyle}>
        <FontAwesome name="rotate-right" size={60} color={colors.text} style={{ transform: [{ rotate: "90deg" }] }} />
      </Animated.View>
    </View>
  );
}

export default Loading;
