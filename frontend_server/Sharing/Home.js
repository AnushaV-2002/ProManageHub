import React from "react";
import MyNavbar from './MyNavbar';
import Header from "./Header";
import About from "./About";
import Goals from "./Goals";
import Contact_Us from "./Contact_Us";
import Footer from './Footer';


function Home(){

 
    return(
      <>
       <MyNavbar/>
       <Header/>
       <About />
       <Goals />
       <Contact_Us/>
       <Footer/>
    
      </>
    )
}

export default Home;