import React from "react";
import { useState } from "react";
import '../css/contact_us.css'
import { useForm } from "react-hook-form"
import { DevTool } from "@hookform/devtools";
import axios from "axios";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Contact_Us(){

  const form = useForm()
  const {register, control, handleSubmit, formState,reset}=form;
  const {errors,isSubmitting,isDirty,isValid}=formState;

//Handling the form Data
const onSubmit=async function(data){
  //Sending the Queries Details to store in the database 
 
  try {
   console.log(data)
   const headers = {
     'Content-Type': 'application/json',
   };
   
   const config = {
     headers: {
       ...headers
     }
   }
   
   const response= await axios.post('https://promanagehub.onrender.com/api/query',data,config)
   if(response.status===200){
    reset()
    toast.success('We have recieved your query, we will get back to you soon...');
   }
  } catch (error) {
   // Handle network errors, request cancellation, etc.
   console.error('Error:', error);
   toast.error('An error occurred. Please try again later!')
 
  }
 
}
    return(
      <section id="contact_us">
      <div className="contact_us_container">
        <h2 className="contact-us_heading">Contact Us</h2>
        <div className="contact_form_container">
            <form  onSubmit={handleSubmit(onSubmit)} noValidate>
                <input className="contact_us_input" type="text" {...register("contact_Name",{
                  required:{
                  value:true,
                  message:"Name field is required"
                  } 
                })} id="contact_Name" placeholder="Enter Your Name"/>
                 {errors.Name&&<p className="error">{errors.contact_Name?.message}</p>}
                <input type="email" className="contact_us_input" {...register("contact_Email",{
                  pattern:{
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Enter Valid Email"
                  },
                  required:{
                     value:true,
                     message:"Email field is required"
                  } 
                })} id="contact_Email" placeholder="Enter Your Email"/>
                 {errors.Name&&<p className="error">{errors.contact_Email?.message}</p>}
                <textarea {...register("Query",{
                  required:{
                  value:true,
                  message:"Query field is required"
                  } 
                })} id="Query" placeholder="Enter Your Query"></textarea>
                 {errors.Name&&<p className="error">{errors.Query?.message}</p>}
                <button disabled={!isDirty||isSubmitting}>Submit</button>
            </form>
            <DevTool control={control} />
            <ToastContainer position="bottom-left" />
        </div>
      </div>
      </section>
    )
}

export default Contact_Us;