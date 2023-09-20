import getColors from "./colors";

const routine = (theme) => {
  const colors = getColors(theme);
  return {
    routineHeader: {
      flexDirection  : "row",
      alignItems     : "center",
      justifyContent : "flex-start",
    },
    routineCurrentItemContainer: {
      flex            : 0.8,
      alignItems      : "center",
      justifyContent  : "center",
      paddingVertical : 8,
    },
    routineMiddleContainer: {
      paddingHorizontal: 16,
    },
    suggestionsButtonContainer: {
      paddingVertical: 16,
    },
    routineItemProgressContainer: {
      paddingVertical: 16,
    },
    routineProgressContainer: {
      paddingVertical: 16,
    },
    stopButtonContainer: {
      paddingTop: 16,
    },
    routineNextItemContainer: {
      flex            : 0.2,
      alignItems      : "center",
      paddingVertical : 16,
    },
    routineAddItemContainer: {
      flexDirection     : "row",
      alignItems        : "center",
      justifyContent    : "space-between",
      borderBottomWidth : 1,
      borderColor       : colors.lowOpacity,
    },
    routineAddItemContainerLeft: {
      flex: 1,
    },
    routineCurrentItemText: {
      fontSize   : 30,
      fontFamily : "Poppins-Black",
      color      : colors.text,
    },
    routineNextItemTitle: {
      fontSize   : 16,
      fontFamily : "Poppins-Black",
      marginLeft : 6,
      color      : colors.highOpacity,
    },
    routineNextItemIcon: {
      transform: [{ translateY: -1 }],
    },
    routineNextItemText: {
      marginLeft : 6,
      fontSize   : 20,
      fontFamily : "Poppins-Black",
    },
    routineButtonsContainer: {
      flexDirection   : "row",
      justifyContent  : "stretch",
      alignItems      : "center",
      paddingVertical : 8,
    },
    routineEstimateContainer: {
      flexDirection   : "row",
      alignItems      : "center",
      justifyContent  : "center",
      paddingVertical : 16,
    },
    estimateText: {
      fontSize   : 16,
      textAlign  : "center",
      fontFamily : "Poppins-Black",
      color      : colors.highOpacity,
    },
    routineButton: {
      flex            : 1,
      alignItems      : "center",
      justifyContent  : "center",
      backgroundColor : colors.background,
    },
    routineButtonCircle: {
      position     : "absolute",
      top          : "50%",
      left         : "50%",
      width        : 100,
      height       : 100,
      borderRadius : 50,
      borderWidth  : 6,
      borderColor  : colors.text,
      transform    : [{ translateX: -30 }, { translateY: -30 }],
    },
    currentRoutineContainer: {
      padding         : 16,
      borderRadius    : 8,
      backgroundColor : colors.text,
    },
    currentRoutineContainerLeft: {
      flex       : 1,
      alignItems : "flex-start",
    },
    currentRoutineContainerRight: {
      alignItems: "flex-end",
    },
    currentRoutineTitle: {
      fontSize   : 20,
      fontFamily : "Poppins-Regular",
      color      : colors.background,
    },
    currentRoutineText: {
      fontSize   : 30,
      lineHeight : 36,
      color      : colors.background,
    },
    nextRoutineText: {
      fontSize   : 16,
      fontFamily : "Poppins-Black",
      color      : colors.background,
      marginLeft : 6,
    },
    currentRoutineItemContainer: {
      flexDirection  : "row",
      justifyContent : "flex-end",
      alignItems     : "center",
    },
    currentRoutineItemText: {
      fontSize   : 16,
      fontFamily : "Poppins-Black",
      color      : colors.background,
      marginLeft : 6,
    },
    routineItemsSectionContainer: {
      marginBottom: 16,
    },
    routineDeleteCustomItemButton: {
      padding    : 6,
      marginLeft : 3,
    },
    taskButton: {
      padding           : 16,
      borderBottomWidth : 1,
      borderColor       : colors.lowOpacity,
    },
    taskButtonText: {
      fontSize   : 20,
      fontFamily : "Poppins-Regular",
      color      : colors.text,
    },
    startRoutineButton: {
      flexDirection: "column",
    },
    completeVideo: {
      position : "absolute",
      top      : 0,
      left     : 0,
      bottom   : 0,
      right    : 0,
    },
    suggestionContainer: {
      paddingVertical : 8,
      flexDirection   : "column",
      alignItems      : "flexStart",
    },
    suggestionBubbleText: {
      fontSize     : 20,
      borderRadius : 100,
      marginLeft   : 10,
      textAlign    : "center",
      fontFamily   : "Poppins-Black",
    },
  };
};

export default routine;
