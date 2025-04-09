import { createContext, useState } from "react";

export const myContext = createContext();

export const SessionProvider = ({ children }) => {
  // const [userLists, setUserLists] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ Dummy auth state
  const [emailPass , setEmailPass] = useState({ username : "" , password : "" })

  return (
    <myContext.Provider value={{ emailPass, setEmailPass, loader, setLoader , isLoggedIn , setIsLoggedIn }}>
      {children}
    </myContext.Provider>
  );
};
