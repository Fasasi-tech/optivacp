import React from 'react'
//import OnWelcome from '../../components/onWelcome/OnWelcome'
import { useNavigate } from 'react-router-dom'
import OnWelcome from '../../components/onWelcome/OnWelcome';

const WelcomePage = () => {
    const navigate = useNavigate();
    const handleWelcomeClose = () =>{
        navigate('/WelcomePage')
    }
  return (
    <div>
        <h1>his</h1>
    </div>
  )
}

export default WelcomePage