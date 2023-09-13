import getColors from "./colors";

const tabBar = (theme) => {
  const colors = getColors(theme);
  return {
    tabBar: {
      borderTopWidth  : 0,
      elevation       : 0,
      height          : 70,
      paddingVertical : 12,
      backgroundColor : colors.background,
    },
    tabBarLabel: {
      fontSize   : 16,
      fontFamily : "Poppins-Black",
    },
  };
};

export default tabBar;
