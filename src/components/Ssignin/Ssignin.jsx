import React from 'react'
import { motion } from 'framer-motion';
import { useMsal } from '@azure/msal-react'
import './ssign.css'
// if you are going to use `loadFull`, install the "tsparticles" package too.
//import { loadSlim } from "tsparticles-slim";

const Ssignin = () => {
    const {instance} = useMsal()
    const handleSignIn =() =>{
        instance.loginRedirect({
            scopes:[ "User.Read"]
        })
    }
  return (
    <div className='ssign_parent_div' >
        <div>
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 5 }}
            className='ssign_parent_div' 
        >
        <h1 className='welcome'>Welcome Optiva's Leave Management system</h1>
        <div>
            <button onClick={handleSignIn} className='sso_sign'>
                Sign In
            </button>            
        </div>
        </motion.div>
           
        </div>
    </div>
  )
}

export default Ssignin