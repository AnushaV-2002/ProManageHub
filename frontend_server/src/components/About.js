import React from "react";
import '../css/about.css'


function About(){
    return(
        <section id="about">
         <div className="about_container">
            <h2 className="about_heading">About ProManageHub</h2>
            <div className="about_parent">
            <div className="about_image"></div>
            <p className="about_content">Welcome to our Personal Projects Management App! We provide developers with a simple yet powerful tool to manage their personal projects effortlessly. Our app is designed to streamline the process of adding, updating, and deleting project details, allowing developers to stay organized and focused on their tasks.</p>
            </div>
         </div>
        </section>
        
    )
}

export default About;