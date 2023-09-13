import getColors from "./colors";

const header = (theme) => {
  const colors = getColors(theme);
  return {
    header: {
      elevation         : 0,
      shadowOpacity     : 0,
      borderBottomWidth : 0,
      backgroundColor   : colors.background,
    },
    headerLeftContainer: {
      paddingLeft: 16,
    },
    headerRightContainer: {
      paddingRight: 16,
    },
    headerTitle: {
      fontSize   : 40,
      fontFamily : "Poppins-Black",
    },
    headerButton: {
      flexDirection   : "row",
      alignItems      : "center",
      paddingVertical : 16,
    },
    headerButtonText: {
      marginLeft : 6,
      lineHeight : 24,
      fontSize   : 16,
      fontFamily : "Poppins-Black",
    },
    headerTintColor: colors.text,
  };
};

export default header;
