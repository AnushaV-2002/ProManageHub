import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/esm/Button';
import { FaUser } from 'react-icons/fa'; // Import the FaUser icon from react-icons
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HashLink as Link} from 'react-router-hash-link';
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import axios from 'axios';
import UserContext from '../contexts/UserContext';

function MyNavbar() {

 const {isAuthenticated,logout}=useContext(AuthContext)
 const{user,setUser}=useContext(UserContext)

 const navigate=useNavigate()
 useEffect(()=>{
  const fetchUser = async () => {
    try {
      const userId = localStorage.getItem('userId');

      if (userId) {
        // Fetch user object from API endpoint
        const response = await axios.get(`http://localhost:3000/api/user/${userId}`);
        const userInfo = response.data;
        // console.log("userinfo", userInfo)
        // Update user state with the fetched user object
        setUser(userInfo);
      }
    } catch (error) {
      // console.error('Error fetching user:', error);
      // Handle error, e.g., set user state to null or display an error message
    }
  };

  fetchUser();
},[])
 const handleLogout = async() => {
  try{
    logout();

    localStorage.removeItem('user');
    localStorage.removeItem('userId');

    const response=await axios.post('http://localhost:3000/api/logout')
    console.log(response)
    navigate('/'); // Navigate to the home page after logout
  }
  catch(error){
    console.log('Logged Out Error', error)
  }
  
};

  return (
    <Navbar expand="lg" style={{ backgroundColor: '#FAF9F6' }} className="bg-body-tertiary" fixed='top'>
      <Container>
        <Navbar.Brand>ProManageHub</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
          {isAuthenticated ? (
              <>
                <Nav.Link><FaUser />{user["Name"]}</Nav.Link> {/* Display the user icon */}
                <Button variant="outline-dark" onClick={handleLogout} style={{ backgroundColor: '#e1c16e' }}>Sign Out</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link}  to="/">Home</Nav.Link>
                <Nav.Link as={Link} smooth to="/#about">About</Nav.Link>
                <Nav.Link as={Link} smooth to="/#goals">Goals</Nav.Link>
                <Button variant="outline-dark" style={{ backgroundColor: '#e1c16e', marginLeft: '10px' }} as={Link} to="/signup">Sign Up</Button>
                <Button variant="outline-dark" style={{ backgroundColor: '#e1c16e', marginLeft: '10px' }} as={Link} to="/login">Login</Button>
                <Nav.Link as={Link} smooth to="/#contact_us">Contact Us</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;