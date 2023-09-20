import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import {
  PanResponder,
  Text,
  TextInput,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import getStyles from "../styles";
import getColors from "../styles/colors";
import { useTheme } from "../ThemeContext";

function CircleDial({
  title, value, max, unit, onChange,
}) {
  const { isDarkMode } = useTheme();
  const styles         = getStyles({ isDarkMode });
  const colors         = getColors({ isDarkMode });

  const [dimensions, setDimensions]     = useState({ width: 300, height: 300 });
  const [percent, setPercent]           = useState(value / max);
  const [circleCenter, setCircleCenter] = useState(null);
  const circleRef                       = useRef(null);

  if (!dimensions) {
    return <View />;
  }

  const strokeWidth         = 20;
  const radius              = dimensions.width / 2 - strokeWidth;
  const snapInterval        = 1;
  const snapValue           = snapInterval / max;
  const circleCircumference = 2 * Math.PI * radius;
  const paddedRadius        = radius + strokeWidth;

  // Calculate the handle position
  const handleAngle = 2 * Math.PI * percent - Math.PI / 2;
  const handleX     = paddedRadius + radius * Math.cos(handleAngle);
  const handleY     = paddedRadius + radius * Math.sin(handleAngle);

  const setCircleCenterCoords = () => {
    circleRef.current.measure((x, y, w, h, px, py) => {
      setCircleCenter({
        circleCenterX : px + radius,
        circleCenterY : py + radius,
      });
    });
  };

  useEffect(() => {
    setCircleCenterCoords();
  }, []);

  const onLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setDimensions({ width, height: width });
  };

  const calculatePercent = (moveX, moveY) => {
    if (circleCenter) {
      const { circleCenterX, circleCenterY } = circleCenter;
      let angle                              = Math.atan2(moveY - circleCenterY, moveX - circleCenterX);

      // Adjust the angle to rotate 90 degrees counter-clockwise (since the circle path was rotated 90 degrees clockwise)
      angle -= Math.PI;

      // Convert from atan2 range to 0 to 2π
      if (angle < 0) { angle += 2 * Math.PI; }

      // Convert to percentage and adjust to have 0% at the top
      let p = angle / (2 * Math.PI);

      // Adjust for the 90-degree offset
      p = (p - 0.25 + 1) % 1;  // Adding 1 before modulo to ensure a positive value

      // Snap to the closest interval
      let snappedPercent = Math.round(p / snapValue) * snapValue;

      // If snapValue is NaN, fallback to 0
      if (Number.isNaN(snappedPercent)) { snappedPercent = 0; }

      // Make sure the snapped value is between 0 and 1
      snappedPercent = Math.min(1, Math.max(0, snappedPercent));

      setPercent(snappedPercent);
      onChange(Math.round(snappedPercent * max));
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder : () => true,
    onPanResponderGrant          : () => setCircleCenterCoords(),
    onPanResponderMove           : (_, { moveX, moveY }) => {
      calculatePercent(moveX, moveY);
    },
  });

  const handleInputChange = (text) => {
    if (text === "") {
      setPercent(0);
      onChange(0);
      return;
    }

    const parsed = parseInt(text, 10);
    if (!Number.isNaN(parsed) && parsed <= max) {
      setPercent(parsed / max);
      onChange(parsed);
    } else if (parsed > max) {
      setPercent(1);
      onChange(max);
    } else {
      setPercent(0);
      onChange(0);
    }
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <View {...panResponder.panHandlers} ref={circleRef} onLayout={onLayout} style={styles.circleDialContainer}>
      <Svg height={paddedRadius * 2} width={paddedRadius * 2}>
        <Path
          d={`M ${paddedRadius} ${paddedRadius} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`}
          stroke={colors.text}
          strokeWidth={strokeWidth}
          fillOpacity={0}
        />
        <Path
          d={`M ${paddedRadius} ${paddedRadius} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`}
          stroke={colors.lowOpacity}
          strokeWidth={strokeWidth + 2}
          strokeDasharray={[circleCircumference, circleCircumference]}
          strokeDashoffset={circleCircumference * percent}
          fillOpacity={0}
          transform={`rotate(90, ${paddedRadius}, ${paddedRadius})`}
        />
        <Circle cx={handleX} cy={handleY} r={strokeWidth} fill={colors.text} />
      </Svg>
      <View style={styles.circleDialContent} height={paddedRadius * 2} width={paddedRadius * 2}>
        <Text style={[styles.text, styles.circleDialTitle]}>{title}</Text>
        <TextInput
          style={[styles.text, styles.circleDialText]}
          value={String(Math.round(percent * max))}
          onChangeText={handleInputChange}
          keyboardType="numeric"
          maxLength={3}
        />
        <Text style={[styles.text, styles.circleDialUnit]}>{unit}</Text>
      </View>
    </View>
  );
}

CircleDial.propTypes = {
  title    : PropTypes.string.isRequired,
  value    : PropTypes.number.isRequired,
  unit     : PropTypes.string.isRequired,
  max      : PropTypes.number.isRequired,
  onChange : PropTypes.func.isRequired,
};

export default CircleDial;
