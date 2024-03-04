import React from "react";
import '../css/header.css'
import Button from 'react-bootstrap/esm/Button';
import { Link } from 'react-router-dom';

function Header(){
    return(

    <div className="header section">
        <div className="overlay">
           <div className="overlay_support">
           <div className="header_name">
               <p>ProManageHub</p>
               <p className="desc">An efficient tool for organizing your personal projects seamlessly!</p>
             </div>
             <Button variant="outline-dark" className="btn-custom"  as={Link} to="/signup">Get Started</Button>
          </div>
       </div>
    </div>

    )
}

export default Header;