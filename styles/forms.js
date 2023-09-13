import getColors from "./colors";

const forms = (theme) => {
  const colors = getColors(theme);
  return {
    input: {
      fontSize          : 40,
      width             : "100%",
      minHeight         : 80,
      fontFamily        : "Poppins-Black",
      borderBottomWidth : 1,
      borderColor       : colors.lowOpacity,
    },
    smallInput: {
      fontSize          : 40,
      width             : "100%",
      fontFamily        : "Poppins-Black",
      borderBottomWidth : 1,
      borderColor       : colors.lowOpacity,
    },
    switchContainer: {
      flexDirection  : "row",
      justifyContent : "space-between",
      alignItems     : "center",
    },
    dialContainer: {
      width          : "100%",
      marginVertical : 20,
    },
    label: {
      fontSize   : 20,
      fontFamily : "Poppins-Regular",
    },
    timePickerContainer: {
      flexDirection : "row",
      alignItems    : "center",
    },
    pickerContainer: {
      flexDirection : "row",
      alignItems    : "center",
    },
    picker: {
      position : "absolute",
      top      : 0,
      left     : 0,
      right    : 0,
      bottom   : 0,
      opacity  : 0,
    },
    pickerValue: {
      fontSize   : 40,
      fontFamily : "Poppins-Black",
    },
    daysContainer: {
      marginBottom   : 24,
      flexDirection  : "row",
      justifyContent : "space-between",
    },
    smallDaysContainer: {
      flexDirection  : "row",
      justifyContent : "space-between",
    },
    dayButton: {
      width           : 46,
      height          : 46,
      borderRadius    : 24,
      justifyContent  : "center",
      alignItems      : "center",
      backgroundColor : colors.lowOpacity,
    },
    smallDayButton: {
      width           : 30,
      height          : 30,
      borderRadius    : 15,
      marginRight     : 4,
      justifyContent  : "center",
      alignItems      : "center",
      backgroundColor : colors.lowOpacity,
    },
    dayButtonSelected: {
      backgroundColor: colors.text,
    },
    dayButtonText: {
      fontSize   : 16,
      lineHeight : 22,
      fontFamily : "Poppins-Black",
      color      : colors.text,
    },
    smallDayButtonText: {
      fontSize   : 15,
      lineHeight : 22,
      fontFamily : "Poppins-Black",
      color      : colors.text,
    },
    dayButtonTextSelected: {
      color: colors.background,
    },
    circleDialContent: {
      position       : "absolute",
      alignContent   : "center",
      justifyContent : "center",
    },
    circleDialTitle: {
      fontSize   : 20,
      fontFamily : "Poppins-Black",
      textAlign  : "center",
    },
    circleDialText: {
      fontSize   : 80,
      fontFamily : "Poppins-Black",
      textAlign  : "center",
      marginTop  : "-5%",
    },
    circleDialUnit: {
      fontSize   : 20,
      fontFamily : "Poppins-Black",
      textAlign  : "center",
      marginTop  : "-10%",
    },
  };
};

export default forms;
