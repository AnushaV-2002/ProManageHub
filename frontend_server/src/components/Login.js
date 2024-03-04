import React from "react";
import "../css/authform.css"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import UserContext from "../contexts/UserContext";

function Login(){
  const{user,setUser}=useContext(UserContext)
  const {login}=useContext(AuthContext)

  const form = useForm()
  const {register, control, handleSubmit, formState}=form;
  const {errors,isSubmitting,isDirty,isValid}=formState

  let navigate = useNavigate();

  const onSubmit=async function(data){
    //Sending the user login credientials Details to server to access the API endpoints. 
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

      const response= await axios.post('http://localhost:3000/api/login',data,config)
      const {token,user}=response.data;
    
      // console.log(response)
      if(response.status===200){
       
        login(token); // Call login function to set token and isAuthenticated state
        // Save user ID to local storage
        localStorage.setItem('userId', user["_id"]);
        // Set user state
        setUser(user);
        //Redirect to dashboard Page
        navigate('/dashboard');
      }

    } 
    catch (error) {
      // console.error('Login error:', error);
      if (error.response && error.response.status) {
        if (error.response.status === 404) {
          toast.error(`${error.response.data.Message}, Check your Email!`);
        } else if (error.response.status === 401) {
          toast.error(error.response.data.Message);
        } else {
          toast.error('An unexpected error occurred');
        }
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  }

  return(
   
   <div className="container">
    <h2 className="title">ProManageHub</h2>
    <div className="grid-container">
       <h2 className="sub-title">Login</h2>
       <form className="authform" onSubmit={handleSubmit(onSubmit)} noValidate>
         <input className="authinput" type="email" {...register("Email",{
           pattern:{
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Enter Valid Email"
          },
          required:{
            value:true,
            message:"Email field is required"
          } 
          })} id="Email" placeholder="Email"/>
          {errors.Email&&<p className="error">{errors.Email?.message}</p>}
         <input className="authinput" type="password" {...register("Password",{
          required:{
            value: true,
            message: "Password field is required"
          }
         })} id="Password"placeholder="Password"/>
         {errors.Password&&<p className="error">{errors.Password?.message}</p>}
         <span><Link to="/forget-password" className="auth_links">Forget Password?</Link></span>
         <button  disabled={!isDirty||isSubmitting}>
           {isSubmitting ? (
             <>
             <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
              Logging In...
             </>
            ) : (
            'Log in'
          )}
         </button>
         <p> <Link to="/signup" className="auth_links">Don't have an Account?, Create One!</Link></p>
         <p> <Link to="/" className="auth_links">Return to Home Page</Link></p>
       </form>
       <ToastContainer position="bottom-left" />    
    </div>
   </div>
  )
}

export default Login;