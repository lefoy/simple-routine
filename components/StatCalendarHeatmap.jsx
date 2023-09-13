import React from "react";
import CalendarHeatmap from "react-native-calendar-heatmap";

import { ScrollView } from "react-native";
import { useTheme } from "../ThemeContext";
import getStyles from "../styles";
import getColors from "../styles/colors";

function StatCalendarHeatmap() {
  const { isDarkMode } = useTheme();
  const styles         = getStyles({ isDarkMode });
  const colors         = getColors({ isDarkMode });

  const scrollRef = React.useRef();

  const colorArray = isDarkMode
    ? ["#181818", "#aaa", "#fff"]
    : ["#eee", "#aaa", "#000"];

  const now = new Date("2023-09-11");

  return (
    <ScrollView
      horizontal
      ref={scrollRef}
      onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: false })}
    >
      <CalendarHeatmap
        endDate={now}
        numDays={180}
        colorArray={colorArray}
        monthLabelsColor={colors.text}
        values={[
          { date: "2023-09-01" },
          { date: "2023-09-02" },
          { date: "2023-09-03" },
          { date: "2023-09-03" },
          { date: "2023-09-03" },
          { date: "2023-09-03" },
          { date: "2023-09-03" },
          { date: "2023-09-03" },
          { date: "2023-09-03" },
          { date: "2023-09-04" },
          { date: "2023-09-05" },
          { date: "2023-09-06" },
          { date: "2023-09-06" },
          { date: "2023-09-08" },
          { date: "2023-09-10" },
        ]}
      />
    </ScrollView>
  );
}

export default StatCalendarHeatmap;
