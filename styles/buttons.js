import getColors from "./colors";

const buttons = (theme) => {
  const colors = getColors(theme);
  return {
    buttonContainer: {
      flex           : 1,
      flexDirection  : "row",
      justifyContent : "space-between",
    },
    buttonIconOnly: {
      padding: 6,
    },
    buttonDragHandle: {
      height  : "100%",
      padding : 6,
    },
    button: {
      flexDirection   : "row",
      alignItems      : "center",
      justifyContent  : "center",
      padding         : 20,
      borderRadius    : 8,
      backgroundColor : colors.text,
    },
    buttonText: {
      fontSize   : 16,
      textAlign  : "center",
      fontFamily : "Poppins-Black",
      color      : colors.background,
    },
    buttonTextBig: {
      fontSize   : 24,
      lineHeight : 28,
      textAlign  : "center",
      fontFamily : "Poppins-Black",
      color      : colors.background,
    },
    buttonIcon: {
      marginRight : 8,
      transform   : [{ translateY: -1 }],
    },
    buttonInlineIcon: {
      marginHorizontal : 5,
      transform        : [{ translateY: -1 }],
    },
    buttonOutline: {
      flexDirection   : "row",
      alignItems      : "center",
      justifyContent  : "center",
      padding         : 10,
      borderRadius    : 8,
      borderWidth     : 4,
      borderColor     : colors.text,
      backgroundColor : colors.background,
    },
    buttonOutlineText: {
      fontSize   : 16,
      textAlign  : "center",
      fontFamily : "Poppins-Black",
      color      : colors.text,
    },
    buttonOutlineIcon: {
      marginRight : 8,
      transform   : [{ translateY: -1 }],
    },
    closeButton: {
      padding: 10,
    },
    stopButton: {
      paddingVertical : 10,
      backgroundColor : colors.background,
    },
    completeButton: {
      backgroundColor: colors.text,
    },
    stopButtonText: {
      fontSize   : 16,
      textAlign  : "center",
      fontFamily : "Poppins-Black",
      color      : colors.text,
    },
    deleteButton: {
      padding         : 10,
      borderColor     : colors.delete,
      backgroundColor : colors.background,
    },
    deleteButtonText: {
      fontSize       : 16,
      textAlign      : "center",
      fontFamily     : "Poppins-Black",
      color          : colors.delete,
      flexDirection  : "row",
      alignItems     : "center",
      justifyContent : "center",
    },
  };
};

export default buttons;
