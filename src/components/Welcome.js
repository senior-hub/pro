import React from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import "../style/Welcome.css";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      

<div className="image-section">
        <img src="ex6.png" alt="Side Image" className="side-image" />
      </div>
      
      <div className="welcome-box">
    
        <h1>Welcome to GrowFit</h1>
        <p>Explore and enjoy your experience!</p>
        <button onClick={() => navigate("/Login")}>Enter App</button>
        
      
    
    </div>


  </div>

  );
}

export default Welcome;
=======
import "../style/Global.css";

function Welcome() {
  const navigate = useNavigate();
  
  return (
    <div className="page-container">
      <div className="auth-container">
        <div className="image-container">
          <img src="ex6.png" alt="Welcome to GrowFit" />
        </div>
        <div className="form-container welcome-content">
          <h2 className="form-title">Welcome to GlowFit</h2>
          <p className="welcome-text">Your journey to fitness and health begins here. Explore and enjoy your experience!</p>
          <button 
            className="submit-button welcome-button"
            onClick={() => navigate("/login")}
          >
            Enter App
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
>>>>>>> copy-enhanced-ui-chatbot-changes
