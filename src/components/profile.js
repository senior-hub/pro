import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from "../context/AppContext";
import Sidebar from "./Sidebar";
import "../style/Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { userId } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form fields
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  
  // Form validation and feedback
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or error
  const [userProfile, setUserProfile] = useState(null);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("loggedIn");
    
    if (!loggedIn) {
      navigate("/login");
    } else {
    }
  }, [navigate, userId]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!dateOfBirth || !gender || !weight || !height || !activityLevel) {
      setMessage("Please fill in all fields");
      setMessageType("error");
      return;
    }
    
    setIsLoading(true);
    setMessage("");

    try {

      const BMI = calculateBMI();
      const requestData = { 
        dateOfBirth, 
        gender, 
        weight, 
        height, 
        activityLevel, 
        userId,
        BMI
      };
      
      const response = await fetch("http://localhost/my-app/src/backend/Profile.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Profile updated successfully!");
        setMessageType("success");
        setTimeout(() => {
          navigate("/SetGoal");
        }, 1500);
      } else {
        setMessage("Error: " + data.message);
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("An error occurred while updating the profile.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate BMI if both height and weight are provided
  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      return bmi;
    }
    return null;
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: "Underweight", color: "#3498db" };
    if (bmi < 25) return { category: "Normal", color: "#2ecc71" };
    if (bmi < 30) return { category: "Overweight", color: "#f39c12" };
    return { category: "Obese", color: "#e74c3c" };
  };

  const bmi = calculateBMI();
  const bmiInfo = bmi ? getBMICategory(bmi) : null;

  return (
    <div className="page-container">
      <Sidebar />
      
      <div className="with-sidebar">
        <div className="profile-container">
          <h2 className="profile-title">Your Profile</h2>
          
          {message && (
            <div className={`message-banner ${messageType === "success" ? "success" : "error"}`}>
              <i className={`fas ${messageType === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`}></i>
              <span>{message}</span>
            </div>
          )}
          
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <i className="fas fa-user"></i>
              </div>
              <h3 className="profile-subtitle">
                {profileExists ? "Update Your Information" : "Complete Your Profile"}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="form-input"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="form-input"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="weight">Weight (kg)</label>
                  <input
                    type="number"
                    id="weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="form-input"
                    min="20"
                    max="300"
                    placeholder="e.g. 70"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="height">Height (cm)</label>
                  <input
                    type="number"
                    id="height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="form-input"
                    min="100"
                    max="250"
                    placeholder="e.g. 175"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="activityLevel">Activity Level</label>
                <select
                  id="activityLevel"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="form-input"
                >
                  <option value="">Select Activity Level</option>
                  <option value="low">Light Active (1-2 days/week)</option>
                  <option value="medium">Moderate (3-5 days/week)</option>
                  <option value="high">Very Active (6-7 days/week)</option>
                </select>
              </div>
              
              {bmi && (
                <div className="bmi-container">
                  <h4>Your BMI</h4>
                  <div className="bmi-value" style={{ color: bmiInfo.color }}>
                    {bmi}
                  </div>
                  <div className="bmi-category" style={{ color: bmiInfo.color }}>
                    {bmiInfo.category}
                  </div>
                </div>
              )}
              
              <button 
                type="submit" 
                className="submit-button profile-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="button-spinner"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    <span>{profileExists ? 'Update Profile' : 'Save Profile'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
