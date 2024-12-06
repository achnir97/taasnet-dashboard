import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of the global context
interface GlobalContextProps {
  userID: string | null;
  setUserID: (id: string | null) => void;
}

// Create the context
const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

// Provider Component
export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userID, setUserID] = useState<string | null>(null); // Global userID state

  return (
    <GlobalContext.Provider value={{ userID, setUserID }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook for consuming the context
export const useGlobalContext = (): GlobalContextProps => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
