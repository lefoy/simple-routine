import getColors from "./colors";

const tabBar = (theme) => {
  const colors = getColors(theme);
  return {
    settingRow: {
      paddingVertical: 16,
    },
    settingText: {
      fontSize   : 20,
      fontFamily : "Poppins-Regular",
    },
    separator: {
      height          : 1,
      backgroundColor : colors.lowOpacity,
    },
  };
};

export default tabBar;
