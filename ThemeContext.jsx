import PropTypes from "prop-types";
import React, {
  createContext, useState, useContext, useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true);  // Default is dark mode

  // Load the theme from AsyncStorage when the component mounts
  useEffect(() => {
    (async () => {
      const storedTheme = await AsyncStorage.getItem("isDarkMode");
      if (storedTheme !== null) {
        setIsDarkMode(JSON.parse(storedTheme));
      }
    })();
  }, []);

  // Save the theme to AsyncStorage whenever it changes
  useEffect(() => {
    AsyncStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
