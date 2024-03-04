import React from "react";
import MyNavbar from './MyNavbar';
import Header from "./Header";
import About from "./About";
import Goals from "./Goals";
import Contact_Us from "./Contact_Us";
import Footer from './Footer';
import ScrollToTopButton from "./ScrollToTopButton";


function Home(){

 
    return(
      <>
      <MyNavbar  aboutId="about" goalsId="goals" contactId="contact"/>
      <Header/>
      <About/>
      <Goals/>
      <Contact_Us/>
      <Footer/>
      <ScrollToTopButton backgroundColor="black"/>
      </>
    )
}

export default Home;