import React from "react";
import '../css/goals.css'

function Goals(){
    return(
      <section id="goals">
       <div className="Goals_container">
          <h2 className="Goals_heading">Goals</h2>
          <div className="Goals_parent">
            <div className="Goals_content">
              <h3>Vision</h3>
              <p>Our vision is to empower developers to effectively manage their personal projects and achieve their goals with confidence. We envision a platform where developers can easily track their projects in an efficient manner.</p>
              <h3>Mission</h3>
              <p>Our mission is to provide developers with a user-friendly and customizable tool that simplifies project management for personal endeavors. We are dedicated to continually enhancing our app to meet the unique needs of developers, ensuring they have the resources they need to succeed in their projects and advance their skills.</p>
            </div>
            <div className="Goals_image"></div>
          </div>
       </div>
       </section>
    )
}

export default Goals;