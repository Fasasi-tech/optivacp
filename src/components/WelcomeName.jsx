import React, {useState, useEffect} from 'react';
import {useMsal} from '@azure/msal-react'

const WelcomeName = () => {
    const {instance} = useMsal()
    const [username, setUserName] = useState('')

    useEffect(()=> {
        const currentAccount = instance.getActiveAccount();
        if (currentAccount){
            setUserName(currentAccount.username)
        }
    }, [instance])
  return (
    <div>Welcome, {username}</div>
  )
}

export default WelcomeName