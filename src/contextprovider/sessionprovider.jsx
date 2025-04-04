import { createContext, useState } from "react";

export const myContext = createContext();

export const SessionProvider = ({ children }) => {
  const [userLists, setUserLists] = useState([]);
  const [loader , setLoader] = useState(false); 

  return (
    <myContext.Provider value={{ userLists, setUserLists , loader, setLoader }}>
      {children}
    </myContext.Provider>
  );
};
