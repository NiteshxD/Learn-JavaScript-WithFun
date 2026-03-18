// =============================================================================
// Theme Context — Dark/Light Mode Management
// =============================================================================
// Manages the global theme state using React Context.
//
// WHY CONTEXT?
//   Theme state needs to be accessible by every component (Navbar toggle,
//   page backgrounds, card styles). React Context avoids "prop drilling"
//   through the entire component tree.
//
// PERSISTENCE:
//   Theme preference is saved to localStorage so it persists across
//   browser sessions. On first load, we check localStorage and fall
//   back to the system preference.
// =============================================================================

import { createContext, useContext, useState, useEffect } from "react";

// Create the context object
const ThemeContext = createContext();

/**
 * ThemeProvider wraps the app and provides theme state
 * @param {Object} props - { children }
 */
export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("jsquiz-theme");
    if (saved) return saved;
    // Default to dark mode on first visit
    return "dark";
  });

  // Apply theme to the document when it changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("jsquiz-theme", theme);
  }, [theme]);

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to access theme context
 * @returns {{ theme: string, toggleTheme: Function }}
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
