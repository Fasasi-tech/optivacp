import React from 'react'
import {useIsAuthenticated, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal} from '@azure/msal-react'
import App from './App'
import Signin from './components/Signin/Signin'

const Apps = () => {
    const IsAuthenticated = useIsAuthenticated()
  return (
    <div>
        {IsAuthenticated ? (<App />) : (<Signin/>)}
    </div>
  )
}

export default Apps