import getColors from "./colors";

const timeProgress = (theme) => {
  const colors = getColors(theme);
  return {
    progressBarContainer: {
      width      : "100%",
      alignItems : "flex-end",
    },
    progressBar: {
      width          : "100%",
      height         : 20,
      borderRadius   : 20,
      overflow       : "hidden",
      marginVertical : 3,
    },
    progressBarProgress: {
      flex            : 1,
      position        : "absolute",
      top             : 0,
      left            : 0,
      minWidth        : 20,
      borderRadius    : 10,
      height          : "100%",
      backgroundColor : colors.text,
    },
    progressBarBackground: {
      flex            : 1,
      borderRadius    : 10,
      width           : "100%",
      height          : "100%",
      backgroundColor : colors.lowOpacity,
    },
    progressBarText: {
      fontSize   : 14,
      fontFamily : "Poppins-Black",
      color      : colors.text,
    },
    progressBarTextContainer: {
      width          : "100%",
      flexDirection  : "row",
      alignItems     : "center",
      justifyContent : "space-between",
    },
  };
};

export default timeProgress;
