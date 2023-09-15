import getColors from "./colors";

const routineList = (theme) => {
  const colors = getColors(theme);
  return {
    emptyRoutineContainer: {
      position       : "absolute",
      top            : 0,
      left           : 0,
      right          : 0,
      bottom         : 0,
      paddingBottom  : "15%",
      justifyContent : "center",
      alignItems     : "center",
    },
    emptyRoutineTitle: {
      fontSize   : 30,
      textAlign  : "center",
      fontFamily : "Poppins-Black",
      color      : colors.text,
    },
    emptyRoutineText: {
      fontSize   : 16,
      textAlign  : "center",
      fontFamily : "Poppins-Regular",
      color      : colors.text,
    },
    routineContainer: {
      minHeight         : 81,
      paddingVertical   : 16,
      borderBottomWidth : 1,
      borderColor       : colors.lowOpacity,
    },
    routineEditItemContainer: {
      flexDirection     : "row",
      alignItems        : "center",
      justifyContent    : "space-between",
      borderBottomWidth : 1,
      borderColor       : colors.lowOpacity,
      backgroundColor   : colors.background,
    },
    routineEditItemContainerRight: {
      flex       : 1,
      marginLeft : 8,
    },
    routineContainerTop: {
      flex           : 1,
      flexDirection  : "row",
      alignItems     : "center",
      justifyContent : "space-between",
    },
    routineLeftContainerLeft: {
      flex           : 1,
      flexDirection  : "row",
      alignItems     : "center",
      justifyContent : "flex-start",
    },
    routineNameContainer: {
      flex           : 1,
      flexDirection  : "row",
      alignItems     : "center",
      justifyContent : "space-between",
      marginTop      : 12,
      marginBottom   : 6,
    },
    routineItemDisabledLine: {
      position        : "absolute",
      top             : "50%",
      left            : 0,
      width           : "100%",
      height          : 2,
      borderRadius    : 1,
      backgroundColor : colors.text,
      transform       : [{ translateY: -1 }],
      opacity         : 0.4,
    },
    routineIcon: {
      width       : 30,
      marginRight : 6,
      transform   : [{ translateY: -1 }],
    },
    routineTitle: {
      fontSize   : 26,
      lineHeight : 30,
      fontFamily : "Poppins-Bold",
    },
    routineBubbleText: {
      fontSize        : 16,
      color           : colors.text,
      backgroundColor : colors.lowOpacity,
      borderRadius    : 20,
      marginLeft      : 10,
      paddingTop      : 3,
      width           : 76,
      textAlign       : "center",
      fontFamily      : "Poppins-Black",
    },
    bottomButtonContainer: {
      paddingTop: 16,
    },
    routineItem: {
      flexDirection  : "row",
      justifyContent : "space-between",
      alignItems     : "center",
    },
    routineButtons: {
      marginTop: 20,
    },
    routineStatsContainer: {
      flexDirection : "row",
      alignItems    : "stretch",
    },
    routineStatContainer: {
      flex            : 1,
      alignItems      : "center",
      justifyContent  : "center",
      padding         : 8,
      borderRadius    : 8,
      marginRight     : 10,
      backgroundColor : colors.lowOpacity,
    },
    routineStatContainerLast: {
      marginRight: 0,
    },
    routineStatTitle: {
      fontSize   : 20,
      lineHeight : 24,
      fontFamily : "Poppins-Black",
    },
    routineStatText: {
      fontSize   : 12,
      lineHeight : 14,
      fontFamily : "Poppins-Black",
      marginTop  : -4,
    },
  };
};

export default routineList;
