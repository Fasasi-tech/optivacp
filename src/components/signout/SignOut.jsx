import React from 'react'
import  './Signout.css'
import {useMsal} from '@azure/msal-react'

const SignOut = () => {
  const {instance} = useMsal();

  const handleSignOut =() =>{
    instance.logoutRedirect();
  }
  return (
    <div onClick={handleSignOut} className='signout'>SignOut</div>
  )
}
 
export default SignOut