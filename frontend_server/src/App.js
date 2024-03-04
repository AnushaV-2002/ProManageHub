import React, { useEffect } from 'react';
import './App.css';
import {  BrowserRouter,Routes, Route, Link, useParams } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import About from './components/About';
import Goals from './components/Goals';
import Contact_Us from './components/Contact_Us';
import ForgetPassword from './components/ForgetPassword';
import { UserProvider } from './contexts/UserContext';
import { AuthProvider } from './contexts/AuthContext';




function App() {
 
  return (
   <>
   <AuthProvider>
   <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" component={About}/>
        <Route path="/goals" component={Goals}/>
        <Route path="/contact" component={Contact_Us}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/forget-password" element={<ForgetPassword/>}/>
        <Route element={<PrivateRoute/>}>
           <Route element={<Dashboard/>} path="/dashboard"/>
        </Route>
      </Routes>
    </BrowserRouter>
  </UserProvider>
  </AuthProvider>
 

     
   </>
  );
}

export default App;
