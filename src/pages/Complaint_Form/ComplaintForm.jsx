import React, {useEffect, useState} from 'react'
import './complaint.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useIsAuthenticated, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal} from '@azure/msal-react'
import {useFormik} from 'formik'
import {InteractionRequiredAuthError} from '@azure/msal-common'


const validate = values => {
  const errors={};

  if(!values.Employee_No){
      errors.Employee_No ='Required';
  } 


  if(!values.Nature_of_Complaint){
      errors.Nature_of_Complaint ='Required';

  }

  if(!values.Date_of_incident){
      errors.Date_of_incident ='Required';
  }

//   if(!values.Description_of_complaint){
//     errors.Description_of_complaint ='Required';
// }

if(!values.Details_of_Incident){
  errors.Details_of_Incident ='Required';
}
  return errors;

}




const ComplaintForm = () => {
  const {instance,  accounts} = useMsal()
const [EmployeeLoading, setEmployeeLoading] = useState(false)
const [EmployeeAPI, setEmployeeAPI]= useState([])
const [apiData, setApiData] = useState([])


const handleSubmit = async (values) =>{
  try{
    const accessTokenRequest = {
      scopes: ["https://api.businesscentral.dynamics.com/.default" ],
      account: accounts[0],
    };

    const accessTokenResponse = await instance.acquireTokenSilent(accessTokenRequest);
    const accessToken = accessTokenResponse.accessToken;

    // Call your API with the token and form data
    const response = await callApi(accessToken, values);
   
    setApiData(response);
      console.log(response)
     if(response?.ok){
      window.alert('successful')
     }


  } catch(error){
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
        const response = await callApi(accessToken, values);

        setApiData(response);

      
      } catch (error) {
        console.error("Acquire token interactive failure:", error);
      }
    }
    console.error("Acquire token silent failure:", error);
  }
}

async function callApi(accessToken, values){
  try{  const response = await fetch("https://api.businesscentral.dynamics.com/v2.0/1a138626-759e-4827-97f1-b49b7fd4caef/OPTIVA_API/ODataV4/Company('My%20Company')/ComplaintFormCard", {
  method: 'POST',
  headers: {
    'Authorization':  `Bearer ${accessToken}`, 
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(values), // Use the form data in the request
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

  const formik = useFormik({
    initialValues:{
      Employee_No:"",
      Nature_of_Complaint:"",
      Date_of_incident:"",
      Details_of_Incident:""

    },
    validate,
    onSubmit: (values, onSubmitProps) => {
    
      console.log(values)
      handleSubmit(values)
      onSubmitProps.setSubmitting(false)
      onSubmitProps.resetForm()    
  }

  })

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

  useEffect(() =>{
    EmployeeData()
  },
  [])

  const getNameFromEmployeeAPi = () =>{
    const employeeWithMatchingEmployeeNo = EmployeeAPI.find((employee) => employee.No ===formik.values.Employee_No)

    if (employeeWithMatchingEmployeeNo){
      const {First_Name, Middle_Name, Last_Name} = employeeWithMatchingEmployeeNo
      return `${First_Name} ${Middle_Name} ${Last_Name}`
    }
      else if (!employeeWithMatchingEmployeeNo){
        return "error fetching employee's name"
      }
   
  }

  const getDepartmentCodeFromEmployeeApi = () => {
    const employeeWithMatchingEmployeeNo = EmployeeAPI.find((employee) => employee.No ===formik.values.Employee_No)

    if (employeeWithMatchingEmployeeNo){
      const {Department_Code} = employeeWithMatchingEmployeeNo
      return Department_Code
    }
      else if (!employeeWithMatchingEmployeeNo){
        return "error fetching employee's name"
      }

  }
  
  const getJobTitleFromEmployeeApi = () => {
    const employeeWithMatchingEmployeeNo = EmployeeAPI.find((employee) => employee.No ===formik.values.Employee_No)

    if (employeeWithMatchingEmployeeNo){
      const {Job_Title} = employeeWithMatchingEmployeeNo
      return Job_Title
    }
      else if (!employeeWithMatchingEmployeeNo){
        return "error fetching Job title"
      }

  }



  return (
    <div className='leaves' >
       <ToastContainer/>
      <div class="custom-text">
        <h1>EMPLOYEE COMPLAINT FORM</h1>
        <span class="custom-before"></span>
      </div>
       <form onSubmit={formik.handleSubmit}>
        <div className='form_sub_divs'>
          <div className='forms m-forms'>
            <input
              type='text'
              name='Employee_No'
              id='Employee_No'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.Employee_No}
              className='form__inputs'
              autoComplete='off'
              placeholder=''
            />
            <label htmlFor='Employee No' className='form__labels'>Employee No</label>
            <div>
              {formik.touched.Employee_No && formik.errors.Employee_No ? <div style={{color:'red'}} className='top'>{formik.errors.Employee_No} </div> : null }
            </div>
          </div>
          
           <div className='forms m-forms'>
            <input 
              type='text'
              name=''
              id=''
              value={formik.values.Employee_No ? getNameFromEmployeeAPi() :''}
              
              className='form__inputs'
              autoComplete='off'
              placeholder=''
            />
            <label htmlFor='Employee Name' className='form__labels'>Employee Name</label>
          </div>
          <div className='forms m-forms'>
            <input 
              type='text'
              name=''
              id=''
              value={formik.values.Employee_No ? getDepartmentCodeFromEmployeeApi() :''}
              className='form__inputs'
              autoComplete='off'
              placeholder=''
            />
            <label htmlFor='Department Code' className='form__labels'>Department Code</label>
          </div>
          <div className='forms m-forms'>
            <input 
              type='text'
              name='Company_email'
              id='Company_email'
              className='form__inputs'
              autoComplete='off'
              placeholder=''
            />
            <label htmlFor='Company Email' className='form__labels'>Company Email</label>
          </div>
          <div className='forms m-forms'>
            <input 
              type='text'
              name=''
              id=''
              className='form__inputs'
              value={formik.values.Employee_No ? getJobTitleFromEmployeeApi() :''}
              autoComplete='off'
              placeholder=''
            />
            <label htmlFor='Job Title' className='form__labels'>Job Title</label>
          </div>
          <div className='forms m-forms'>
            <input 
              type='text'
              name='Nature_of_Complaint'
              id='Nature_of_Complaint'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.Nature_of_Complaint}
              className='form__inputs'
              autoComplete='off'
              placeholder=''
            />
          
            <label htmlFor='Nature of Complaint' className='form__labels'>Nature of Complaint</label>
            <div>
              {formik.touched.Nature_of_Complaint && formik.errors.Nature_of_Complaint ? <div style={{color:'red'}} className='top'>{formik.errors.Nature_of_Complaint} </div> : null }
            </div>
          </div>
       
          <div className='forms m-forms'>
            <textarea cols='50'
              type='text'
              name='Details_of_Incident'
              id='Details_of_Incident'
              onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.Details_of_Incident}
              className='form__inputs'
              autoComplete='off'
              placeholder=''
            />
            <label htmlFor='Details of Incident' className='form__labels'>Details of Incident</label>
            <div>
              {formik.touched.Details_of_Incident && formik.errors.Details_of_Incident ? <div style={{color:'red'}} className='top'>{formik.errors.Details_of_Incident} </div> : null }
            </div>
          </div>
          <div className='forms m-forms'>
            <input 
              type='date'
              name='Date_of_incident'
              id='Date_of_incident'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.Date_of_incident}
              className='form__inputs'
              autoComplete='off'
              placeholder=''
            />
            <label htmlFor='Description of incident' className='form__labels'>Date of incident</label>
            <div>
              {formik.touched.Date_of_incident && formik.errors.Date_of_incident ? <div style={{color:'red'}} className='top'>{formik.errors.Date_of_incident} </div> : null }
            </div>
          </div>
          {/* <div className='forms m-forms'>
            <textarea cols='50'
              type='text'
              name='Description_of_complaint'
              id='Description_of_complaint'
              onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.Description_of_complaint}
              className='form__inputs'
              autoComplete='off'
              placeholder=''
            />
            <label htmlFor='Description of complaint' className='form__labels'>Description of complaint</label>
            <div>
              {formik.touched.Description_of_complaint && formik.errors.Description_of_complaint ? <div style={{color:'red'}} className='top'>{formik.errors.Description_of_complaint} </div> : null }
            </div>
          </div> */}
          <button type="submit" className={`submits ${!formik.isValid || formik.isSubmitting? 'disabled':''}`} disabled={!formik.isValid || formik.isSubmitting} >Submit</button>
        </div>
       </form>
    </div>
  )
}

export default ComplaintForm