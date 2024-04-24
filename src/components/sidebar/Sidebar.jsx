import React, {useState} from 'react'
import {Link,NavLink} from 'react-router-dom'
import './sidebar.css'
import { links } from '../Data';
import { useStateContext } from '../../context/ContextProvider';
import {GiCancel} from 'react-icons/gi'
import {RiArrowDropDownLine, RiArrowDropRightLine} from 'react-icons/ri'

import Logo from './optivac.png'

const Sidebar = () => {

    const {activeMenu, setActiveMenu, screenSize, toggleWhiteMode, toggleDarkMode, mode}=useStateContext();
    const [expandedTitles, setExpandedTitles] = useState({});
    const handleCloseSideBar = () => {
        if (activeMenu && screenSize <= 900) {
          setActiveMenu(false);
        }
    }
    const toggleTitle = (title) => {
        setExpandedTitles((prevState) => ({
          ...prevState,
          [title]: !prevState[title],
        }));
      };

      
    
  return (
    <div className={`sidebar_div sidebarr ${mode==='dark' ? 'sidebar_div_dark':'sidebar_div'}`}>
        {activeMenu && (<>
            <div className={`img_logo ${mode==='dark'? 'img_logo_black' : 'img_logo'  }`}>
                <Link to='/' onClick={handleCloseSideBar} className="sidebar_logo"> <img src={Logo} alt='alt' className='nav_pics'/>  </Link>
                <button type='button' onClick={()=>setActiveMenu(!activeMenu)} className='circle'>
                < GiCancel />
                </button>
            </div>
            <div className={`container ${mode==='dark'? 'container_dark':'container'}`}>
                {links.map((item, index) =>(
                      <div key={index}>
                        <p className={`map_link ${mode==='dark'? 'map_link_dark':'map_link'} `}  onClick={() => toggleTitle(item.title)}>
                            {expandedTitles[item.title]?(<RiArrowDropDownLine className='style-color'/>):
                            (<RiArrowDropRightLine className='style-color'/>)}{item.title}</p>
                        {expandedTitles[item.title] && item.links.map((link)=>(
                    <NavLink to={`/${link.name}`}  onClick={handleCloseSideBar} 
                     style={ ({isActive}) => ({
                        backgroundColor: isActive ? '#722F37' : "",
                     })}  className ={({isActive}) => isActive ? 'active-link' : `normal_link link_icon ${mode==='dark'?'normal_link_dark':'normal_link link_icon'}`} >
                        <div className="link_dashboard">
                        <span className='link_icon' >{link.icon}</span>
                        <span className='link_name'>{link.name}</span>
                        </div>
                   
                    </NavLink>
                ))}
                </div>
        ))}

                {/* <NavLink className='dsh'  style={ ({isActive}) => ({
                        backgroundColor: isActive ? '#722F37' : "",
                     })} >
                    <h1>Sign out</h1>
                </NavLink> */}
            </div>
        </>)}
    </div>
  )
}

export default Sidebar