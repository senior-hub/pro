import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from "../context/AppContext";

function SetGoal() {
    const { navigate, userId, theme, toggleTheme } = useApp();

    
  

    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [checkedGoals, setCheckedGoals] = useState({});


    useEffect(() => {


        //authrizaition check
        const loggedIn = sessionStorage.getItem("loggedIn");
        if (!loggedIn) {
            navigate("/login");
            return;
        }


        //send request to get "Fitness Goals" from backend
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
      
        try {
          // Filter to get only the IDs of the checked goals
          const selectedGoalIds = Object.keys(checkedGoals).filter(goalId => checkedGoals[goalId]);
      
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
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };
      

    if (loading) return <p>Loading goals...</p>;
    if (error) return <p>Error loading goals: {error}</p>;

    return (
        <div>
            <h1  style={styles.container}>Select Your Fitness Goals</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                {goals.map(goal => (
                    <label key={goal.id}>
                        <input
                            type="checkbox"
                            name={goal.id.toString()}
                            checked={checkedGoals[goal.id] || false}
                            onChange={handleCheckboxChange}
                        />
                        {goal.goal_name}
                    </label>
                ))}
                <button type="submit" style={styles.button}>Next</button>
            </form>
          
          
        </div>
    );
}

const styles = {
    container: { textAlign: "center", padding: "20px" },
    form: { display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px", margin: "auto" },
    button: { padding: "10px", backgroundColor: "blue", color: "white", borderRadius: "5px", cursor: "pointer" },
};

export default SetGoal;
