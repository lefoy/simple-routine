const getColors = (theme) => ({
  background    : theme.isDarkMode ? "black" : "white",
  text          : theme.isDarkMode ? "white" : "black",
  lowOpacity    : theme.isDarkMode ? "#222" : "#f3f3f3",
  mediumOpacity : theme.isDarkMode ? "#555" : "#d3d3d3",
  highOpacity   : theme.isDarkMode ? "#888" : "#b3b3b3",
  delete        : "#d00",
});

export default getColors;
