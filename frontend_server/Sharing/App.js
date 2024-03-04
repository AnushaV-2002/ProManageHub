import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';




function App() {

  return (
   <>
 
   <BrowserRouter>
   <Routes>
       <Route path="/" element={<Home/>}/>
       <Route path="/login" element={<Login/>}/>
       <Route path="/signup" element={<Signup/>}/>
   </Routes>
  
   </BrowserRouter>
    
     
   </>
  );
}

export default App;
