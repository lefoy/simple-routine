import getColors from "./colors";

const routineProgress = (theme) => {
  const colors = getColors(theme);
  return {
    routineProgressBarContainer: {
      width      : "100%",
      alignItems : "flex-end",
    },
    routineProgressBar: {
      width          : "100%",
      height         : 4,
      borderRadius   : 2,
      overflow       : "hidden",
      marginVertical : 3,
      position       : "relative",
    },
    routineProgressBarProgress: {
      flex            : 1,
      position        : "absolute",
      top             : 0,
      left            : 0,
      minWidth        : 3,
      borderRadius    : 10,
      height          : "100%",
      backgroundColor : colors.text,
    },
    routineProgressBarBackground: {
      flex            : 1,
      borderRadius    : 10,
      width           : "100%",
      height          : "100%",
      backgroundColor : colors.mediumOpacity,
    },
    routineProgressBarIcons: {
      width          : "100%",
      flexDirection  : "row",
      alignItems     : "center",
      justifyContent : "space-between",
      marginTop      : -24,
    },
    routineProgressBarIcon: {
      width           : 36,
      height          : 36,
      lineHeight      : 36,
      borderRadius    : 18,
      textAlign       : "center",
      backgroundColor : colors.background,
    },
  };
};

export default routineProgress;
