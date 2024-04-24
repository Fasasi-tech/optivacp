import React from 'react'
import { useMsal } from '@azure/msal-react'

const Signin = () => {
    const {instance} = useMsal()
    const handleSignIn =() =>{
        instance.loginRedirect({
            scopes:[ "User.Read"]
        })
    }
  return (
    <div>
        <button onClick={handleSignIn}>
            Sign In
        </button>
    </div>
  )
}

export default Signin