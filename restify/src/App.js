import logo from './logo.svg';
import './App.css';
import {APIContext} from "./Contexts/APIContext";
import {useState} from "react";
import Router from "./components/Routers";

function App() {
    const [refresh, setRefresh] = useState(0);

  return (
      <APIContext.Provider value={{refresh, setRefresh}}>
        <Router />
      </APIContext.Provider>
  );
}


export default App;
