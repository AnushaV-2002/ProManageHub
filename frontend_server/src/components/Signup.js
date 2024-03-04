import React from "react";
import "../css/authform.css"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom";
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";


function Signup(){

 const form = useForm()
 const {register, control, handleSubmit, formState,reset}=form;
 const {errors,isSubmitting,isDirty,isValid}=formState;

 const navigate=useNavigate();

 //Handling the form Data
 const onSubmit=async function(data){
   //Sending the Sign up Details to store in the database 
   try {
    // console.log(data)
    const headers = {
      'Content-Type': 'application/json',
    };
    
    const config = {
      headers: {
        ...headers
      }
    }
    
    const response= await axios.post('http://localhost:3000/api/signup',data,config)
    const {Message}=response.data;
    // console.log("message", Message)
    if(response.status===200){
      reset()
      toast.success(`${Message} You will Navigate to Login Page Shortly!`);
 
      setTimeout(() => {
        navigate('/login'); // Navigate after showing the toast
      }, 3000);
    }
   } catch (error) {
    // Handle network errors, request cancellation, etc.
    // console.error('Error:', error);
    toast.error('An error occurred. Please try again later!');
   }
  
 }

  return(
   
   <div className="container">
    <h2 className="title">ProManageHub</h2>
    <div className="grid-container">
       <h2 className="sub-title">Sign Up</h2>
       <form className="authform" onSubmit={handleSubmit(onSubmit)} noValidate>
         <input className="authinput" type="text" {...register("Name",{
          required:{
            value:true,
            message:"Name field is required"
          } 
          })}  id="Name" placeholder="Name"/>
         {errors.Name&&<p className="error">{errors.Name?.message}</p>}
         <input className="authinput" type="email" {...register("Email",{
          pattern:{
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Enter Valid Email"
          },
          required:{
             value: true,
             message:"Email field is required"
          },
          validate: {
            emailAvailable: async (value) => {
              try {
                // API request to check if the email is available
                const response = await axios.post(`http://localhost:3000/api/user/${value}`);
                const isAvailable = !response.data; // If response.data is falsy, email is available
      
                return isAvailable || "Email already exists!";
              } catch (error) {
                // console.error('Error:', error);
               
              }
            }
          }
         })} id="Email" placeholder="Email"/>
         {errors.Email&&<p className="error">{errors.Email?.message}</p>}
         <input className="authinput" type="password" {...register("Password",{
          required:{
            value: true,
            message: "Password field is required"
          }
         })} id="Password" placeholder="Password"/>
         {errors.Password&&<p className="error">{errors.Password?.message}</p>}
         <button disabled={!isDirty || isSubmitting}>
          {isSubmitting ? (
            <>
           <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
             Signing Up...
            </>
           ) : (
          'Sign Up'
          )}
         </button>
         <p><Link to="/login" className="auth_links">Already have an Account? Log In</Link></p>
         <p><Link to="/" className="auth_links">Return to Home Page</Link></p>
       </form>
       <ToastContainer position="bottom-left" />
    </div>
   </div>
  )
}

export default Signup;