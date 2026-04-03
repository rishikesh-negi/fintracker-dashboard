import { createContext, use, useEffect, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type DarkModeContextType = null | {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextType>(null);

type DarkModeProviderProps = {
  children: ReactNode;
};

function DarkModeProvider({ children }: DarkModeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useLocalStorage(
    "isDarkMode",
    window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((mode: boolean) => !mode);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

function useDarkMode() {
  const context = use(DarkModeContext);
  if (!context) throw new Error("Context was used outside its provider");
  return context;
}

export { DarkModeProvider, useDarkMode };
