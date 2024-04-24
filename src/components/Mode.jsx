import React from 'react'
import {MdOutlineLightMode, MdOutlineDarkMode} from 'react-icons/md'
import { useStateContext } from '../context/ContextProvider'
import './mode.css'
const Mode = () => {
    const {toggleWhiteMode, toggleDarkMode, mode} = useStateContext();
  return (
    <div className={`mode_div ${mode === 'dark' ? 'mode_div_black': 'mode_div'}`}>
        <div>
            <p onClick={toggleWhiteMode} className='cursor_p'> <span><MdOutlineLightMode/></span> Light</p>
            <p onClick={toggleDarkMode}  className='cursor_p'><span><MdOutlineDarkMode/></span> Dark</p>
        </div>
    </div>
  )
}

export default Mode