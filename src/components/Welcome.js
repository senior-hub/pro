import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/Welcome.css";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      

<div className="image-section">
        <img src="ex6.png" alt="Side Image" className="side-image" />
      </div>
      
      <div className="welcome-box">
    
        <h1>Welcome to GlowFit</h1>
        <p>Explore and enjoy your experience!</p>
        <button onClick={() => navigate("/Login")}>Enter App</button>
        
      
    
    </div>


  </div>

  );
}

export default Welcome;
