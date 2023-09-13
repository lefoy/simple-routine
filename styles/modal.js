import getColors from "./colors";

const modal = (theme) => {
  const colors = getColors(theme);
  return {
    modalContainer: {
      flex            : 1,
      backgroundColor : colors.background,
    },
    modalContent: {
      paddingHorizontal: 16,
    },
    modalFooter: {
      marginTop    : "auto",
      marginBottom : 12,
    },
    sectionHeaderText: {
      fontSize   : 30,
      fontFamily : "Poppins-Black",
      color      : colors.text,
    },
    emojiSearchInput: {
      minHeight : 50,
      fontSize  : 30,
    },
    emojiButton: {
      flex           : 0.2,
      height         : 60,
      alignItems     : "center",
      justifyContent : "center",
    },
  };
};

export default modal;
