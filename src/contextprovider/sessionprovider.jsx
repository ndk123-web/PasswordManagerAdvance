import { createContext, useState } from "react";

export const myContext = createContext();

export const SessionProvider = ({ children }) => {
  const [userLists, setUserLists] = useState([]);

  return (
    <myContext.Provider value={{ userLists, setUserLists }}>
      {children}
    </myContext.Provider>
  );
};
