import getColors from "./colors";

const base = (theme) => {
  const colors = getColors(theme);
  return {
    container: {
      position          : "relative",
      flex              : 1,
      paddingHorizontal : 16,
      backgroundColor   : colors.background,
    },
    scrollContainer: {
      minHeight: "100%",
    },
    scrollContentContainer: {
      minHeight: "100%",
    },
    listFooter: {
      flex           : 1,
      justifyContent : "flex-end",
    },
    centerContainer: {
      flex           : 1,
      justifyContent : "center",
      alignItems     : "center",
    },
    emptyContainer: {
      flex            : 1,
      paddingVertical : 32,
      alignItems      : "center",
      justifyContent  : "center",
    },
    row: {
      flexDirection  : "row",
      alignItems     : "center",
      justifyContent : "space-between",
    },
    flexRow: {
      flex           : 1,
      flexDirection  : "row",
      alignItems     : "center",
      justifyContent : "space-between",
    },
    loadingContainer: {
      position        : "absolute",
      top             : 0,
      left            : 0,
      width           : "100%",
      height          : "100%",
      flex            : 1,
      justifyContent  : "center",
      alignItems      : "center",
      backgroundColor : colors.background,
    },
    loadingText: {
      color      : colors.text,
      fontSize   : 16,
      fontFamily : "Poppins-Black",
    },
    loadingTextWithoutFont: {
      color    : colors.text,
      fontSize : 16,
    },
    text: {
      color: colors.text,
    },
    title: {
      fontSize   : 40,
      fontFamily : "Poppins-Black",
      color      : colors.text,
    },
    disabled: {
      opacity: 0.3,
    },
    spacer: {
      marginTop: "auto",
    },
    spacerPadding: {
      marginTop : "auto",
      height    : 16,
    },
    colSpacer: {
      width: 10,
    },
    paddingContainer: {
      paddingVertical: 8,
    },
    deleteButtonContainer: {
      paddingBottom: 16,
    },
  };
};

export default base;
