import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from "../context/AppContext";
import Sidebar from "./Sidebar";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../style/SetGoal.css";

// Icon mapping for different goal types
const goalIcons = {
  'Lose Weight': 'fas fa-weight',
  'Build Muscle': 'fas fa-dumbbell',
  'Improve Cardio': 'fas fa-heartbeat',
  'Increase Flexibility': 'fas fa-child',
  'Reduce Stress': 'fas fa-peace',
  'Better Sleep': 'fas fa-moon',
  'Improve Posture': 'fas fa-walking',
  'Increase Energy': 'fas fa-bolt',
  'Enhance Athletic Performance': 'fas fa-running',
  'Tone Body': 'fas fa-user',
  'Build Strength': 'fas fa-fist-raised'
};

// Default icon if goal name doesn't match any in the mapping
const defaultIcon = 'fas fa-bullseye';

function SetGoal() {
  const { userId } = useApp();
  const navigate = useNavigate();
  
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedGoals, setCheckedGoals] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Authorization check
    const loggedIn = sessionStorage.getItem("loggedIn");
    if (!loggedIn) {
      navigate("/login");
      return;
    }

    // Fetch fitness goals from backend
    fetch('http://localhost/my-app/src/backend/FetchGoals.php', { credentials: 'include' })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data)) throw new Error("Data is not an array");
        setGoals(data);
      })
      .catch(error => {
        console.error('Error fetching goals:', error);
        setError(error.toString());
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    
    console.log(`Checkbox for goal ID ${name} changed to ${checked ? 'checked' : 'unchecked'}`);
    setCheckedGoals(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Validate at least one goal is selected
    const selectedGoalIds = Object.keys(checkedGoals).filter(goalId => checkedGoals[goalId]);
    if (selectedGoalIds.length === 0) {
      alert("Please select at least one fitness goal");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const requestData = { selectedGoalIds, userId };
      console.log("Sending Data:", requestData);
      
      const response = await fetch("http://localhost/my-app/src/backend/insetGoals.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestData })
      });
      
      const data = await response.json();
      console.log("Success:", data);
      
      if (data.success) {
        // Navigate to /Home on success
        navigate("/Home");
      } else {
        console.error("Operation failed:", data.message);
        setError(data.message || "Failed to save goals. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the icon for a specific goal
  const getGoalIcon = (goalName) => {
    // Try to find a matching icon, or use the default
    for (const [key, value] of Object.entries(goalIcons)) {
      if (goalName.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }
    return defaultIcon;
  };

  // Check if any goals are selected
  const hasSelectedGoals = Object.values(checkedGoals).some(value => value);

  if (loading) {
    return (
      <div className="page-container">
        <Sidebar />
        <div className="with-sidebar">
          <div className="goals-container">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading fitness goals...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <Sidebar />
        <div className="with-sidebar">
          <div className="goals-container">
            <div className="error-container">
              <i className="fas fa-exclamation-circle error-icon"></i>
              <p>Error loading goals: {error}</p>
              <button className="submit-button" onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Sidebar />
      <div className="with-sidebar">
        <div className="goals-container">
          <h1 className="goals-title">Select Your Fitness Goals</h1>
          <p className="goals-subtitle">
            Choose the fitness goals that matter to you. This will help us personalize your 
            experience and recommend the right workouts and nutrition plans.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="goals-form">
              {goals.map(goal => (
                <div className="goal-card" key={goal.id}>
                  <input
                    type="checkbox"
                    id={`goal-${goal.id}`}
                    name={goal.id.toString()}
                    className="goal-checkbox"
                    checked={checkedGoals[goal.id] || false}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor={`goal-${goal.id}`} className="goal-label">
                    <div className="goal-icon">
                      <i className={getGoalIcon(goal.goal_name)}></i>
                    </div>
                    {goal.goal_name}
                  </label>
                </div>
              ))}
            </div>
            
            <div className="submit-container">
              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting || !hasSelectedGoals}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner"></span> Saving...
                  </>
                ) : (
                  <>Continue <i className="fas fa-arrow-right"></i></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SetGoal;