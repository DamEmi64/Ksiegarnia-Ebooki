import React from "react";

export interface PreferencesProps {
  isDarkMode: boolean;
  fontSize: number;
}

export interface PreferencesContextType {
  preferences: PreferencesProps;
  setIsDarkMode: (newIsDarkMode: boolean) => void;
  setFontSize: (newFontSize: number) => void;
}

export const PreferencesContext: React.Context<PreferencesContextType | undefined> =
  React.createContext<PreferencesContextType | undefined>(undefined);

const PreferencesProvider = (props: { children: React.ReactNode }) => {

  const [preferences, setPreferences] = React.useState<PreferencesProps>({
    isDarkMode: false,
    fontSize: 13
  });

  const setIsDarkMode = (newIsDarkMode: boolean) => {
    setPreferences({...preferences, isDarkMode: newIsDarkMode})
  };

  const setFontSize = (newFontSize: number) => {
    setPreferences({...preferences, fontSize: newFontSize})
  }

  return (
    <PreferencesContext.Provider value={{ preferences, setIsDarkMode, setFontSize }}>
      {props.children}
    </PreferencesContext.Provider>
  );
};

export default PreferencesProvider;
