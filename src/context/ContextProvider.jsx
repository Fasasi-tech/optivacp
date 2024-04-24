
import React, {createContext, useContext, useState, useEffect} from 'react';

const StateContext = createContext();

const initialState = {
  userMode:false,
  cart: false,
}

export const ContextProvider =({children}) =>{
  const savedMode = localStorage.getItem('mode');
    const [screenSize, setScreenSize] = useState(undefined);
    const [activeMenu, setActiveMenu] = useState(true);
    const [isClicked, setIsClicked] = useState(initialState);
    const [mode, setMode] =useState(savedMode === 'dark' ? 'dark' : 'light')
  
    useEffect(() => {
      localStorage.setItem('mode', mode);
    }, [mode]);

    const toggleDarkMode = ()=>{
      setMode('dark')
    }

    const toggleWhiteMode = () =>{
      setMode('light')
    }

    const handleClick = (clicked) => {
      setIsClicked((prevState) => ({
        ...initialState,
        [clicked]: !prevState[clicked],
      }));
    };
  
    return (
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      <StateContext.Provider value={{ activeMenu, screenSize, setScreenSize, setActiveMenu, isClicked, setIsClicked, mode, toggleDarkMode, toggleWhiteMode, handleClick}}>
        {children}
      </StateContext.Provider>
    );
  };
  
  export const useStateContext = () => useContext(StateContext);
  