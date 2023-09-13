import getColors from "./colors";

const routineItem = (theme) => {
  const colors = getColors(theme);
  return {
    routineItemContainer: {
      flex            : 1,
      flexDirection   : "row",
      alignItems      : "center",
      justifyContent  : "space-between",
      paddingVertical : 16,
    },
    routineItemContainerLeft: {
      flexDirection  : "row",
      alignItems     : "center",
      justifyContent : "flex-start",
    },
    routineItemIcon: {
      marginRight : 8,
      transform   : [{ translateY: -1 }],
    },
    routineItemTitle: {
      fontSize   : 20,
      fontFamily : "Poppins-Regular",
    },
    routineItemBubbleText: {
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
  };
};

export default routineItem;
