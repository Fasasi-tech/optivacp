import React, {useState, useEffect} from 'react'
import './leaveApplication.css'
import {useIsAuthenticated, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal} from '@azure/msal-react'
import {InteractionRequiredAuthError} from '@azure/msal-common'
import WelcomeName from '../../components/WelcomeName'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LeaveApplication = () => {
  const {instance,  accounts} = useMsal()
  const IsAuthenticated = useIsAuthenticated()
  const [username, setUserName] = useState('')
  const [apiData, setApiData] = useState(null);
  const [responsibilityCenters, setResponsibilityCenters] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loadingResponsibilityCenters, setLoadingResponsibilityCenters] = useState(false);
  const [loadingLeaveTypes, setLoadingLeaveTypes] = useState(false);
  const [leavePeriod, setLeavePeriod] = useState([]);
  const [loadingLeavePeriod, setLoadingLeavePeriod] = useState(false);
  const [companyEmailError, setCompanyEmailError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [submitting, setSubmitting] = useState(false);
  const [employee, setEmployee] = useState([])
  const [employeeLoading, setEmployeeLoading] =useState(false)
  const [employeeDataLoading, setEmployeeDataLoading] = useState(false)
  const [employeesData, setEmployeesData] = useState(null)
  const [employeeAPI, setEmployeeAPI] = useState([]);
  const [returningDate, setReturningDate] = useState(null);

  const [formData, setFormData] = useState({
    Responsibility_Center:"",
    Company_Email:"",
    Leave_Period:"",
    Leave_Type:'',
    Days_Applied:"",
    Cell_Phone_Number:"",
    E_mail_Address:"",
    Date_of_Exam:null,
    Number_of_Previous_Attempts:"",
    Details_of_Examination:"",
    Employee_Reliver:"",
    Start_Date:""

    //file:null
  })

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

const [employeeData, setEmployeeData] = useState({
  EmpName: "",
  Employee_No: "",
});

const [loadingEmployeeData, setLoadingEmployeeData] = useState(false);


//getting the returnuing date

const {Start_Date, Days_Applied} = formData;

useEffect(() => {
  calculateReturningDate()

}, [Start_Date, Days_Applied])
 
const calculateReturningDate = () =>{
  if (!Start_Date || isNaN(Days_Applied)) {
    console.error('Invalid input. Please provide a valid start date and days applied.');
    setReturningDate(null);
    return;
  }
  const startDate = new Date(Start_Date);
const getStartDateday = new Date(startDate)
// const calcReturningDate = getStartDateday + Days_Applied;
let remainingDays = Days_Applied;

while (remainingDays > 0 ){
  getStartDateday.setDate(getStartDateday.getDate() +1)
   // Check if the current date is not a weekend (Saturday or Sunday)
   if (getStartDateday.getDay() !== 0 && getStartDateday.getDay() !== 6) {
    remainingDays -= 1;
  }
}
//getStartDateday.setDate(startDate.getDate() +Days_Applied)
// getStartDateday.setDate(startDate.getDate()+Days_Applied)
console.log(startDate)
setReturningDate(getStartDateday)
}


const handleInputChange = async (e) => {
  const { name, value } = e.target;

  const formattedValue = name === 'Start_Date' ? formatToMMDDYYYY(value) : value;
  const formattedValue2 = name==='Date_of_Exam' ? formatToMMDDYYYY(value) : formattedValue
  const parsedValue = name==='Days_Applied'? parseFloat(value, 10) : formattedValue2
  
  setFormData({
    ...formData,
    [name]: parsedValue,
  });

 

  if (name === 'Company_Email' && !value.trim()) {
    setCompanyEmailError('');
    return;
  }

  if (name === 'Company_Email' && !value.includes('@optivacp.com')){
    setCompanyEmailError('Invalid Email')
  }else if (name === 'Company_Email' && value.includes('@optivacp.com')){
    setCompanyEmailError('')
  }

  //value.trim indicates that there is not whitespaces in the value
  if (name === 'E_mail_Address' && !value.trim()) {
    //!value.trim means there is not value and whitespaces
    setEmailError('');
    return;
    //The return statement is used to exit a function early if a specific condition is met
    // if the condition is met, exit the function don't go to the next block of code in the function. The return isn't necessary for if-else
  }

  if (name === 'E_mail_Address' && !value.includes('@')){
    setEmailError('Invalid Email')
  }else if (name === 'E_mail_Address' && value.includes('@')){
    setEmailError('')
  }

  if (name === 'Cell_Phone_Number' && !value.trim()) {
    setPhoneNumber('');
    return;
  }

  if (name === 'Cell_Phone_Number' && (value.length < 11 || value.length > 11)){
    setPhoneNumber('Invalid Phone Number')
  }else{
    setPhoneNumber('')
  }

};

const handleFileChange = async (e) =>{
  const file = e.target.files[0];

  // Convert the file to Blob
  const blobData = await fileToBlob(file);
  setFormData({
    ...formData,
    file: blobData,
  });
}
const fileToBlob = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const blobData = new Blob([reader.result], { type: file.type });
      resolve(blobData);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};

const isCompanyEmailValid = formData.Company_Email.includes('@optivacp.com') && !emailError;
const isEmailValid = formData.E_mail_Address.includes('@') && !emailError;
const isFormDataValid = formData.Cell_Phone_Number && !phoneNumber;

//if one of these logic is valid, gray out the submit button
const isSubmitted = !isCompanyEmailValid || !isEmailValid || !isFormDataValid

// Function to check if a date is a weekend (saturday or sunday)
const isWeekend = () => {
  if (!formData.Start_Date) {
    return false; // Return false if Start_Date is not set
  }
  const dayOfWeek = new Date(formData.Start_Date).getDay()
  return dayOfWeek ===0 || dayOfWeek ===6
}

 // Function to calculate the minimum allowed date (2 days from today)
 const calculateMinDate = () => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 3);
  return currentDate.toISOString().split('T')[0];
};

  const handleSubmit = async(e)=>{
    e.preventDefault();
    setSubmitting(true)
    try {
      const accessTokenRequest = {
        scopes: ["https://api.businesscentral.dynamics.com/.default" ],
        account: accounts[0],
      };
      const accessTokenResponse = await instance.acquireTokenSilent(accessTokenRequest);
      const accessToken = accessTokenResponse.accessToken;

      // Call your API with the token and form data
      const response = await callApi(accessToken, formData);
     

      setApiData(response);
      console.log(response)
     if(response?.ok){
      window.alert('successful')
     }
     setSubmitting(false)
      
    
      
      
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        try {
          const accessTokenRequest = {
            scopes: ["user.read"],
            account: accounts[0],
            
          };
          const accessTokenResponse = await instance.acquireTokenPopup(accessTokenRequest);
          const accessToken = accessTokenResponse.accessToken;
          console.log(accessToken)
          // Call your API with the token and form data
          const response = await callApi(accessToken, formData);

          setApiData(response);

        
        } catch (error) {
          console.error("Acquire token interactive failure:", error);
        }
      }
      console.error("Acquire token silent failure:", error);
    }
    
  };

  

  async function callApi(accessToken, formData){
    try{  const response = await fetch("https://api.businesscentral.dynamics.com/v2.0/1a138626-759e-4827-97f1-b49b7fd4caef/OPTIVA_API/ODataV4/Company('My%20Company')/HRLeaveApplicationCard", {
    method: 'POST',
    headers: {
      'Authorization':  `Bearer ${accessToken}`, 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData), // Use the form data in the request
  });
 


  if (response.status === 401) {
    console.error("Unauthorized error: Check your token and permissions.");
    console.log(accessToken)
  }
  
  
  else if (response.ok) {
    const data = await response.json();

   if(data){
    toast.success('Record submitted successfully', {
      position: "top-center",
      autoClose: 10000, // Adjust the duration as needed
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    }
    )
   }
    // Handle the successful response data
    setFormData({
      Responsibility_Center: '',
      Company_Email: '',
      Leave_Period:'',
      Leave_Type:'',
      Start_Date: '',
      Days_Applied:'',
      Cell_Phone_Number:'',
      E_mail_Address:'',
      Date_of_Exam:'',
      Number_of_Previous_Attempts:'',
      Details_of_Examination:'',
      Employee_Reliver:""
    })
    console.log(data)
  }else{

    const errorData = await response.json();
    throw new Error(errorData.error.message); // Extracting error message
   
  }
  } catch (error) {
    // Handle any network errors or errors thrown from the API call
    console.error('API Error:', error.message);
    toast.error( error.message,{
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

  }
    }

      // Fetch responsibility centers from Business Central when the component mounts
      const fetchResponsibilityCenters = async () => {
        try {
          setLoadingResponsibilityCenters(true); // Set loading state to true

          const accessTokenRequest = {
            scopes: ["https://api.businesscentral.dynamics.com/.default"],
            account: accounts[0],
          };
          const accessTokenResponse = await instance.acquireTokenSilent(accessTokenRequest);
          const accessToken = accessTokenResponse.accessToken;

          const response = await fetch("https://api.businesscentral.dynamics.com/v2.0/1a138626-759e-4827-97f1-b49b7fd4caef/OPTIVA_API/ODataV4/Company('My%20Company')/ResponsibilityCenterList", {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`, // Include your access token
              'Content-Type': 'application/json',
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            setResponsibilityCenters(data.value);
          } else {
            console.error('Error fetching responsibility centers from Business Central:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching responsibility centers from Business Central:', error);
        } finally {
          setLoadingResponsibilityCenters(false); // Set loading state back to false when fetching is complete
        }
      };
  
      // Fetch responsibility centers when the component mounts
      

   // Empty dependency array ensures the effect runs only once when the component mounts
   
   const handleResponsibilityCenterClick = () => {
    // Fetch responsibility centers when the dropdown is cli
   // cked
    fetchResponsibilityCenters();
  };

  useEffect(() => {
    // Fetch responsibility centers when the component mounts
    fetchResponsibilityCenters();
  }, []);  

  const LeaveTypes = async () => {
    try {
      setLoadingLeaveTypes(true); // Set loading state to true

      const accessTokenRequest = {
        scopes: ["https://api.businesscentral.dynamics.com/.default"],
        account: accounts[0],
      };
      const accessTokenResponse = await instance.acquireTokenSilent(accessTokenRequest);
      const accessToken = accessTokenResponse.accessToken;

      const response = await fetch("https://api.businesscentral.dynamics.com/v2.0/1a138626-759e-4827-97f1-b49b7fd4caef/OPTIVA_API/ODataV4/Company('My%20Company')/HRLeaveTypes", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Include your access token
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLeaveTypes(data.value);
      } else {
        console.error('Error fetching responsibility centers from Business Central:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching responsibility centers from Business Central:', error);
    } finally {
      setLoadingLeaveTypes(false); // Set loading state back to false when fetching is complete
    }
  };
  const handleLeaveTypeClick = () => {
    // Fetch responsibility centers when the dropdown is clicked
    LeaveTypes();
  };

  useEffect(() => {
    // Fetch responsibility centers when the component mounts
    LeaveTypes();
  }, []);  

  const EmployeeTypes = async () => {
    try {
      setEmployeeDataLoading(true); // Set loading state to true

      const accessTokenRequest = {
        scopes: ["https://api.businesscentral.dynamics.com/.default"],
        account: accounts[0],
      };
      const accessTokenResponse = await instance.acquireTokenSilent(accessTokenRequest);
      const accessToken = accessTokenResponse.accessToken;

      const response = await fetch("https://api.businesscentral.dynamics.com/v2.0/1a138626-759e-4827-97f1-b49b7fd4caef/OPTIVA_API/ODataV4/Company('My%20Company')/HREmployeeList", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Include your access token
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEmployee(data.value);
      } else {
        console.error('Error fetching responsibility centers from Business Central:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching responsibility centers from Business Central:', error);
    } finally {
      setEmployeeDataLoading(false); // Set loading state back to false when fetching is complete
    }
  };
  const handleEmployeeTypeClick = () => {
    // Fetch responsibility centers when the dropdown is clicked
    EmployeeTypes();
  };

  useEffect(() => {
    // Fetch responsibility centers when the component mounts
    EmployeeTypes();
  }, []);
  
  
  const EmployeeData = async () => {
    try {
      setEmployeeLoading(true); // Set loading state to true

      const accessTokenRequest = {
        scopes: ["https://api.businesscentral.dynamics.com/.default"],
        account: accounts[0],
      };
      const accessTokenResponse = await instance.acquireTokenSilent(accessTokenRequest);
      const accessToken = accessTokenResponse.accessToken;

      const response = await fetch("https://api.businesscentral.dynamics.com/v2.0/1a138626-759e-4827-97f1-b49b7fd4caef/OPTIVA_API/ODataV4/Company('My%20Company')/HREmployeeList", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Include your access token
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const EmployeeApidata = await response.json();
        setEmployeeAPI(EmployeeApidata.value)
       
       
      } else {
        console.error('Error fetching employees data from Business Central:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching employees data from Business Central:', error);
    } finally {
      setEmployeeLoading(false); // Set loading state back to false when fetching is complete
    }
  };
  // const handleEmployeeData = () => {
  //   // Fetch responsibility centers when the dropdown is clicked
  //   EmployeeData();
  // };

  // useEffect(() => {
  //   // Fetch Employee when the component mounts
  //   if (formData.Company_Email){
  //      EmployeeData();
  //   }
    
  // }, [formData.Company_Email]);  

useEffect(() =>{
  EmployeeData()
},
[])

//console.log(employeeAPI)
// get employee Name
const getNameFromEmployeeAPi = () =>{
  const employeeWithMatchingEmail = employeeAPI.find((employee)=> employee.Company_E_Mail ===formData.Company_Email)
  if (employeeWithMatchingEmail) {
    const {First_Name, Middle_Name, Last_Name} = employeeWithMatchingEmail;
    return `${First_Name}  ${Middle_Name}  ${Last_Name}`
  } else if (!employeeWithMatchingEmail){

    return 'employee not found'
  }
}

const getJobFromEmployeeAPi = () =>{
  const employeeWithMatchingEmail = employeeAPI.find((employee)=> employee.Company_E_Mail ===formData.Company_Email)
  if (employeeWithMatchingEmail) {
    const {Job_Title} = employeeWithMatchingEmail;
    return `${Job_Title}`
  } else{
    return 'You do not have a job title'
  }
}

const getNoFromEmployeeAPi = () =>{
  const employeeWithMatchingEmail = employeeAPI.find((employee)=> employee.Company_E_Mail ===formData.Company_Email)
  if (employeeWithMatchingEmail) {
    const {No} = employeeWithMatchingEmail;
    return `${No}`
  } else{
    return 'You do not have an employee No'
  }
}
// const employeeWithMatchingEmail = employeeAPI.find((employee)=> employee.Company_E_Mail ==='tfasasi@optivacp.com')
// console.log(getNameFromEmployeeAPi())

  const LeavePeriod = async () => {
    try {
      setLoadingLeavePeriod(true); // Set loading state to true

      const accessTokenRequest = {
        scopes: ["https://api.businesscentral.dynamics.com/.default"],
        account: accounts[0],
      };
      const accessTokenResponse = await instance.acquireTokenSilent(accessTokenRequest);
      const accessToken = accessTokenResponse.accessToken;

      const response = await fetch("https://api.businesscentral.dynamics.com/v2.0/1a138626-759e-4827-97f1-b49b7fd4caef/OPTIVA_API/ODataV4/Company('My%20Company')/HRLeavePeriodList", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Include your access token
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLeavePeriod(data.value);
      } else {
        console.error('Error fetching responsibility centers from Business Central:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching responsibility centers from Business Central:', error);
    } finally {
      setLoadingLeavePeriod(false); // Set loading state back to false when fetching is complete
    }
  };
  const handleLeavePeriodClick = () => {
    // Fetch responsibility centers when the dropdown is clicked
    LeavePeriod();
  };

    const formatToMMDDYYYY = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // Months are zero-based
    const day = date.getDate();
    const year = date.getFullYear();

    // Ensure two-digit format for month and day
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedDay = day < 10 ? `0${day}` : `${day}`;

    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  return (
    <div className='leave'>
      <ToastContainer/>
      <div class="custom-text">
        <h1>HR LEAVE APPLICATION FORM</h1>
        <span class="custom-before"></span>
      </div>
      <div className='isAuth'>
        {IsAuthenticated ? <WelcomeName />: null}
      </div>
      
      <div className='form_div'>
        <form onSubmit={handleSubmit}>
          <div className='form_sub_div'>
            <div className='form m-form input-group' >
              <select
                id="Responsibility_Center"
                name="Responsibility_Center"
                value={formData.Responsibility_Center}
                onChange={handleInputChange}
                onClick={handleResponsibilityCenterClick}
                className='select'
                >
                <option value="">{loadingResponsibilityCenters ? 'Loading...' : ''}</option>
                {responsibilityCenters.map((center) => (
                <option key={center.Id} value={center.Id}>
                  {center.Code}
                </option>
                  ))}
              </select>
              <label className='placeholder'>Responsibility Center</label>
            </div>

            <div className='form m-form'>
                <input type="text"
                  id="Company_Email"
                  name="Company_Email"
                  value={formData.Company_Email}
                  onChange={handleInputChange}
                  className='form__input'
                  autoComplete='off'
                  placeholder=''
                />
                <label for="Company_Email" className='form__label'>Company Email</label>
                <div className='company_email_div'>
                 {companyEmailError&&<p style={{color:'red'}} className='email_validation'>{companyEmailError}</p> }
                </div>
                
            </div>
            <div className='form m-form'>
                <input type="text"
                  id=""
                  name=""
                  value={formData.Company_Email ? getNameFromEmployeeAPi():''}
                  // onChange={handleInputChange}
                  className='form__input'
                  autoComplete='off'
                  placeholder=''
                  readOnly
                />
                <label for="Applicant Name" className='form__label'>Applicant Name</label>
                <div className='company_email_div'>
                 {/* {companyEmailError&&<p style={{color:'red'}} className='email_validation'>{companyEmailError}</p> } */}
                </div>
                
            </div>
            <div className='form m-form'>
                <input type="text"
                  id=""
                  name=""
                  value={formData.Company_Email ?getJobFromEmployeeAPi() : ''}
                  // onChange={handleInputChange}
                  className='form__input'
                  autoComplete='off'
                  placeholder=''
                  readOnly
                />
                <label for="Company_Email" className='form__label'>Job Title</label>
                <div className='company_email_div'>
                 {/* {companyEmailError&&<p style={{color:'red'}} className='email_validation'>{companyEmailError}</p> } */}
                </div>
                
            </div>
            <div className='form m-form'>
                <input type="text"
                  id=""
                  name=""
                  value={formData.Company_Email ? getNoFromEmployeeAPi():''}
                  // onChange={handleInputChange}
                  className='form__input'
                  autoComplete='off'
                  placeholder=''
                  readOnly
                />
                <label for="Company_Email" className='form__label'>Employee NO</label>
                <div className='company_email_div'>
                 {/* {companyEmailError&&<p style={{color:'red'}} className='email_validation'>{companyEmailError}</p> } */}
                </div>
                
            </div>
            
            {/* <div className='form m-form'>
              <input
                type="text"
                id="Employee_Name"
                name="Employee_Name"
                value={employeeData.EmpName}
                className='form__input'
                autoComplete='off'
                placeholder=''
                readOnly
              />
              <label htmlFor="Employee_Name" className='form__label'>Employee Name</label>
            </div> */}
            {/* <div className='form m-form'>
              <input
                type="text"
                id="Employee_Number"
                name="Employee_Number"
                value={employeeData.Employee_No}
                className='form__input'
                autoComplete='off'
                placeholder=''
                readOnly
              />
               <label htmlFor="Employee_Number" className='form__label'>Employee Number</label>
           </div> */}
            <div  className='m-form form input-group'> 
            <select
                id="Leave_Period"
                name="Leave_Period"
                value={formData.Leave_Period}
                onChange={handleInputChange}
                onClick={handleLeavePeriodClick}
                className='select'>
                <option value="">{loadingLeaveTypes ? 'Loading...': ''}</option>
                {leavePeriod.map((leave) =>(
                  <option key={leave.id} value={leave.id}>{leave.Period_Code}</option>
                ))}
            </select>
              <label for="Leave Period" className='placeholder'>Leave Period</label>
            </div>

            <div className='m-form form input-group' >
              <select
                id="Leave_Type"
                name="Leave_Type"
                value={formData.Leave_Type}
                onChange={handleInputChange}
                onClick={handleLeaveTypeClick}
                className='select'>
                <option value="">{loadingLeaveTypes ? 'Loading...': ''}</option>
                {leaveTypes.map((leave) =>(
                  <option key={leave.id} value={leave.id}>{leave.Code}</option>
                ))}
              </select>
              <label className='placeholder'>Leave Type</label>
            </div>
            <div className='m-form form input-group'>
              <input type="Date"
                id="Start_Date"
                name="Start_Date"
                value={formData.Start_Date}
                onChange={handleInputChange}
                className='select'
                min = {calculateMinDate()}
                  
                  
              />
              <label className='placeholder'>Start Date</label>
              <span class="calendar-icon"></span>
              <div className='company_email_div'>
                 {formData.Start_Date&& isWeekend() && (<p style={{color:'red'}} className='email_validation'>Please select a weekday</p>) }
                </div>
            </div>
           
            <div className='form m-form'>
              
              <input
                type="number"
                id="Days_Applied"
                name="Days_Applied"
                value={formData.Days_Applied}
                onChange={handleInputChange}
                min="0"
              className='form__input'
              autoComplete='off'
              placeholder=''
              />
              <label for = 'Days_Applied' className='form__label'>Days Applied</label>
           </div>
           {returningDate !== null && (
             <div className='m-form form input-group'>
             <input type="Date"
               id=""
               name=""
               value={returningDate.toISOString().split('T')[0]}
               onChange={handleInputChange}
               className='select'
               readOnly
             />
             <label className='placeholder'>Return Date</label>
             <span class="calendar-icon"></span>
           </div>
           )}
          
           <div className='form m-form'>
            <input
              type="text"
              id="Cell_Phone_Number"
              name="Cell_Phone_Number"
              value={formData.Cell_Phone_Number}
              onChange={handleInputChange}
              className='form__input'
              autoComplete='off'
              placeholder=''     
            />
            <label htmlFor="Cell_Phone_Number" className='form__label'>Cell phone Number</label>
            <div className='company_email_div'>
                 {phoneNumber&&<p style={{color:'red'}} className='email_validation'>{phoneNumber}</p> }
                </div>
           </div>
           <div className='form m-form'>       
              <input
                type="text"
                id="E_mail_Address"
                name="E_mail_Address"
                value={formData.E_mail_Address}
                onChange={handleInputChange}
                className='form__input'
                autoComplete='off'
                placeholder='' 
              />
              <div>

              </div>
              <label htmlFor="E_mail_Address" className='form__label'>Email Address</label>
              <div className='company_email_div'>
                 {emailError&&<p style={{color:'red'}} className='email_validation'>{emailError}</p> }
              </div>
            </div>
            <div className='m-form form input-group'>
              <input
                type="date"
                id="Date_of_Exam"
                name="Date_of_Exam"
                value={formData.Date_of_Exam}
                onChange={handleInputChange}
                className='select'
              />
              <label htmlFor="Date_of_Exam" className='placeholder'>Date of Exam</label>
            </div>
            <div className='form m-form'>
              <input
                type="text"
                id="Number_of_Previous_Attempts"
                name="Number_of_Previous_Attempts"
                value={formData.Number_of_Previous_Attempts}
                onChange={handleInputChange}
                className='form__input'
                autoComplete='off'
                placeholder='' 
              />
              <label htmlFor="Number_of_Previous_Attempts" className='form__label'>Number of Previous Attempts</label>
           </div>
           <div className='form m-form'>
              <input
                type="text"
                id="Details_of_Examination"
                name="Details_of_Examination"
                value={formData.Details_of_Examination}
                onChange={handleInputChange}
                className='form__input'
                autoComplete='off'
                placeholder=''
              />
               <label htmlFor="Details_of_Examination" className='form__label'>Details of Examination</label>
            </div>
            {/* <div className='form m-form'>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
                className='form__input'
                autoComplete='off'
                placeholder=''
                

              />
              <label htmlFor="file" className='form__label'>Picture</label>
            </div> */}
             <div className='m-form form input-group' >
              <select
                id="Employee_Reliver"
                name="Employee_Reliver"
                 value={formData.Employee_Reliver}
                 onChange={handleInputChange}
                onClick={handleEmployeeTypeClick}
                className='select'>
                <option value="">{employeeLoading ? 'Loading...': ''}</option>
                {employee.filter((employe) => employe.Department_Code === formData.Responsibility_Center).map((employe) =>(
                  <option key={employe.id} value={employe.No}>{employe.No}{' '}{employe.First_Name}{' '}{employe.Middle_Name}{' '}({employe.Department_Code})</option>
                ))}
              </select>
              <label className='placeholder'>Employee Reliever</label>
            </div>
          
              {/* <input type="text"
                // id="Start_Date"
                // name="Start_Date"
                // value={formData.Start_Date}
                // onChange={handleInputChange}
                className='select'
              /> */}
              {/* {employeesData && employeesData.EmployeeNo } */}
              {/* <span class="calendar-icon"></span> */}
          </div> 
          <button type="submit" className={`submit  ${isSubmitted? 'disabled' : ''}`} disabled={isSubmitted}>{submitting? 'Submitting...':apiData ?'Submitted':'Submit'}</button>
        </form>
      </div>
    </div>
  )
}

export default LeaveApplication