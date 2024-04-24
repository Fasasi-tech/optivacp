import React, {useEffect, useState} from 'react'
import './navbar.css'
import { useStateContext } from '../../context/ContextProvider';
import {FaBars} from 'react-icons/fa'
import {MdOutlineLightMode, MdOutlineDarkMode} from 'react-icons/md'
import Mode from '../Mode';
import {useIsAuthenticated, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal} from '@azure/msal-react'
import {InteractionRequiredAuthError} from '@azure/msal-common'
import SignOut from '../signout/SignOut';
import Signin from '../Signin/Signin';


const NavButton = ({ customFunc, icon, color, app }) => (
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className={app}
    >
      {icon}
    </button>
);

const Navbar = () => {
    const {activeMenu, setActiveMenu,setScreenSize,handleClick, screenSize, isClicked, mode, toggleWhiteMode, toggleDarkMode} = useStateContext();
    const {instance} = useMsal()
    const IsAuthenticated = useIsAuthenticated()
    const [username, setUserName] = useState('')

    useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);


  useEffect(() => {
    if(!IsAuthenticated){
      instance.ssoSilent({
        scopes:["user.read"],
        loginHint:{username}
      }).then((response)=>{
        instance.setActiveAccount(response.account)

      }).catch((error) => {if (error instanceof InteractionRequiredAuthError) {
        instance.loginRedirect({
          scopes:["user.read"]
        })

      }})
    }
  }, [])

  useEffect(()=> {
    const currentAccount = instance.getActiveAccount();
    if (currentAccount){
        setUserName(currentAccount.username)
    }
}, [instance])

  const lightMode = <MdOutlineLightMode/>
  const darkMode = <MdOutlineDarkMode/> 

  const handleActiveMenu = () => setActiveMenu(!activeMenu);
  return (
    <div  className={`navbar_parent_div ${mode==='dark'?'navbar_parent_div_dark': "navbar_parent_div"}`}>
        <NavButton  customFunc={handleActiveMenu} app={`navbar_button ${mode=== 'dark' ? 'navv': 'navbar_button' }`} color="#722F37" icon={<FaBars />} />
        {/* <div>
         <NavButton customFunc={() =>handleClick('userMode')} color="#722F37" app={`navbar_button ${mode=== 'dark' ? 'navv': 'navbar_button' }`} icon={mode ==='dark'? darkMode: lightMode}/>
         {isClicked.userMode && (<Mode/>)}
        </div> */}
        <div>
          {IsAuthenticated ?<SignOut/> : <Signin/>}
        </div>
    </div>
  )
}

export default Navbar