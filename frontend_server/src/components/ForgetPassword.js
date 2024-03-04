import React from "react";
import '../css/forgetpassword.css'
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form"
import { DevTool } from "@hookform/devtools";
import Spinner from 'react-bootstrap/Spinner';
import { Toast } from 'react-bootstrap';
import axios from 'axios';

function ForgetPassword(){

    const form = useForm()
    const {register, control, handleSubmit, formState}=form;
    const {errors,isSubmitting,isDirty,isValid}=formState;

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const navigate = useNavigate()
    //Handling the form Data
    const onSubmit=async function(data){
        try{
            // console.log(data)

            const headers = {
               'Content-Type': 'application/json',
            };
    
            const config = {
               headers: {
                 ...headers
             }
            }

           const response = await axios.post('https://promanagehub.onrender.com/api/forget-password', data, config)
           if(response.status===200){
              //  console.log(response.data)
               setToastMessage(`Password Reset Link is sent to your Email, Check Your Email!`);
               setShowToast(true);
               setTimeout(() => {
                navigate('/login'); // Navigate after showing the toast
              }, 3000);
           }
          }
        catch(error){
          // console.log(error);
          if (error.response && error.response.status) {
            if(error.response.status===500){
              setToastMessage(`Internal Server Error, Try Again Later!`);
              setShowToast(true);
            }
            else if(error.response.status===404){
              setToastMessage(error.response.data.Message);
              setShowToast(true);
            }
          }
        }
    }

    return(
     <div className="resetpassword_container">
        <h2 className="reset_password_title">ProManageHub</h2>
        <div className="reset_container">
            <h4 className="reset_password_title">Forget Password</h4>
            <form className="reset_form"  onSubmit={handleSubmit(onSubmit)} noValidate>
                <input className="reset_input" type="email" {...register("Email",{
                    pattern:{
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Enter Valid Email"
                      },
                      required:{
                         value: true,
                         message:"Email field is required"
                      }
                })} placeholder="Enter your Email"/>
                 {errors.Email&&<p className="error">{errors.Email?.message}</p>}
                <button disabled={!isDirty||isSubmitting} className="reset_link_button">
                  {isSubmitting ? (
                            <>
                            <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                            Sending The Reset Link...
                            </>
                            ) : (
                              'Send Reset Link'
                               )
                  }
                </button>
                <p style={{textAlign: "center"}}><Link to="/login" className="auth_links">Return to Login Page</Link></p>
            </form>
            <DevTool control={control} />
            <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
              <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </div>
     </div>
    )
}

export default ForgetPassword;