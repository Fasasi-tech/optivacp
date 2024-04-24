
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ContextProvider } from './context/ContextProvider';
import {PublicClientApplication, EventType } from '@azure/msal-browser';

const pca= new PublicClientApplication({
  auth: {
    clientId:process.env.REACT_APP_CLIENT_ID,
    authority:process.env.REACT_APP_AUTHORITY,
    redirectUri:process.env.REACT_APP_REDIRECT_URI
  },
  cache:{
    cacheLocation:'localStorage',
    storeAuthStateInCookie: false,
  }, 
  system:{
    loggerOptions:{
      loggerCallback: (level, message, containsPII) =>{
        console.log(message)
      },
      logLevel:"Info"
    }
  }
})

pca.addEventCallback(event => {
  if (event.eventType===EventType.LOGIN_SUCCESS) {
    console.log(event)
    pca.setActiveAccount(event.payload.account);
  }
})

// console.log( process.env.REACT_APP_AUTHORITY)
 console.log(2)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ContextProvider>
      <App msalInstance={pca} />
    </ContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
