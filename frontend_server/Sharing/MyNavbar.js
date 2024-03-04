import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/esm/Button';
import { FaUser } from 'react-icons/fa'; // Import the FaUser icon from react-icons
import { Link } from 'react-router-dom';
import { useState } from 'react';

function MyNavbar() {

  const[isLoggedIn,SetisLoggedIn]=useState(false);

  return (
    <Navbar expand="lg" style={{ backgroundColor: '#FAF9F6' }} className="bg-body-tertiary" fixed="top">
      <Container>
        <Navbar.Brand href="#home">ProManageHub</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
          {isLoggedIn ? (
              <>
                <Nav.Link><FaUser />Anusha</Nav.Link> {/* Display the user icon */}
                <Button variant="outline-dark" style={{ backgroundColor: '#e1c16e' }}>Sign Out</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="#about">About</Nav.Link>
                <Nav.Link as={Link} to="#goals">Goals</Nav.Link>
                <Button variant="outline-dark" style={{ backgroundColor: '#e1c16e', marginLeft: '10px' }} as={Link} to="/signup">Sign Up</Button>
                <Button variant="outline-dark" style={{ backgroundColor: '#e1c16e', marginLeft: '10px' }} as={Link} to="/login">Login</Button>
                <Nav.Link as={Link} to="#contact_us">Contact Us</Nav.Link>
              </>
            )}
            
          </Nav>
        
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;