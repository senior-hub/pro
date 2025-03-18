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
        const loggedIn = sessionStorage.getItem("loggedIn");
        if (!loggedIn) {
            navigate("/login");
            return;
        }

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
        setCheckedGoals(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const selectedGoalIds = Object.keys(checkedGoals).filter(goalId => checkedGoals[goalId]);
            const requestData = { selectedGoalIds, userId };
            const response = await fetch("http://localhost/my-app/src/backend/insetGoals.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestData })
            });
            const data = await response.json();
            if (data.success) {
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
        <div style={styles.container}>
            <h1>Select Your Fitness Goals</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                {goals.map(goal => (
                    <label key={goal.id} style={styles.goalLabel}>
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
    container: {
        textAlign: "center",
        padding: "40px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        maxWidth: "2000px",
        margin: "auto",
        marginTop: "50px" ,
        marginbuttom:"50px"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },
    goalLabel: {
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },
    button: {
        padding: "10px",
        backgroundColor: "green",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s"
    },
    buttonHover: {
        backgroundColor: "#0056b3"
    }
};

export default SetGoal;
