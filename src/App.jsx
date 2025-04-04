import "./index.css";
import Navbar from "./components/Navbar";
import Manager from "./components/Manager";
import { myContext } from "./contextprovider/sessionprovider";
import { useState } from "react";

function App() {
  const [userLists , setUserLists] = useState([]);
  return (
    <>
    <myContext.Provider value={{ userLists , setUserLists }}> 
      <Manager />
    </myContext.Provider>
    </>
  );
}

export default App;
