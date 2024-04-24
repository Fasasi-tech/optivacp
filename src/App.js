import React, {useState} from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar'
import Sidebar from './components/sidebar/Sidebar'
import { useStateContext } from './context/ContextProvider';
import EmployeeDetails from './pages/Employee_Details/EmployeeDetails';
import LeaveApplication from './pages/Leave_Application/LeaveApplication';
import LeaveHistory from './pages/Leave_History/LeaveHistory';
import './App.css';
import { MsalProvider, useIsAuthenticated, AuthenticatedTemplate, useMsal, UnauthenticatedTemplate } from '@azure/msal-react'
import OnWelcome from './components/onWelcome/OnWelcome';
import WelcomePage from './pages/welcomepage/WelcomePage';
import Signin from './components/Signin/Signin';
import Ssignin from './components/Ssignin/Ssignin';
import ComplaintForm from './pages/Complaint_Form/ComplaintForm';

const App = ({msalInstance}) => {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
  };

  const handleContinue = () => {
    setShowWelcome(false);
    // Additional logic to navigate to the homepage if needed
  };

  const{activeMenu, mode}=useStateContext()
  return (
    <MsalProvider instance={msalInstance}>
    <div className={` ${mode==='dark'?'all':"nall"}`}>
      <AuthenticatedTemplate>
      <BrowserRouter>
        
        <div className={`parent_app_div ${mode==='dark'? 'parent_app_div_dark':'parent_app_div'}`}>
          {activeMenu ?(
            <div className={`initial_sidebar sidebar ${mode==='dark' ?'initial_sidebar_dark sidebar': 'initial_sidebar sidebar'}`}>
            <Sidebar/>
            </div>
          ) : (
            <div className="final_sidebar" >
                <Sidebar/>
              </div>
          )}
           <div className={activeMenu?`active_first ${mode==='dark'?'active_first_dark':'active_first'} `:`active_second ${mode==='dark'?'active_second_dark':'active_second'} `}>
              <div className= {`navbar_div_app navbar ${mode==='dark' ?'navbar_div_app_dark navbar':'navbar_div_app navbar'}`} >
                  <Navbar/>
              </div>
              <div >
                <Routes>
                  <Route path='/' element={<LeaveApplication />}/>
                  <Route path='/WelcomePage' element= {<WelcomePage />} />
                  <Route path='/Leave Application Form' element={<LeaveApplication />} />
                  <Route path='/complaint Form' element={<ComplaintForm/>}/>
                </Routes>
              </div>
        </div>
      </div>
      
      </BrowserRouter>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
       <Ssignin />
      </UnauthenticatedTemplate>

    </div>
    </MsalProvider>
  )
}

export default App
