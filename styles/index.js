import { StyleSheet } from "react-native";

import analytics from "./analytics";
import base from "./base";
import buttons from "./buttons";
import forms from "./forms";
import header from "./header";
import modal from "./modal";
import routine from "./routine";
import routineItem from "./routineItem";
import routineList from "./routineList";
import RoutineProgress from "./routineProgress";
import settings from "./settings";
import tabBar from "./tabBar";
import timeProgress from "./timeProgress";

const getStyles = (theme) => StyleSheet.create({
  ...analytics(theme),
  ...base(theme),
  ...buttons(theme),
  ...forms(theme),
  ...header(theme),
  ...modal(theme),
  ...routine(theme),
  ...routineItem(theme),
  ...routineList(theme),
  ...RoutineProgress(theme),
  ...settings(theme),
  ...tabBar(theme),
  ...timeProgress(theme),
  ...analytics(theme),
});

export default getStyles;
