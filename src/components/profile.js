import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';




function Profile() {



      const navigate = useNavigate();
    
      const userId = sessionStorage.getItem("userId");
    
      useEffect(() => {
        const loggedIn = sessionStorage.getItem("loggedIn");
    
        if (!loggedIn) {
          navigate("/login");
        }
      }, [navigate]);


    // Define state for each form field and any other necessary state
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState("");
    const [weight, setWeight] = useState(0); // Assuming weight is a number
    const [height, setHeight] = useState(0); // Assuming height is a number
    const [activityLevel, setActivityLevel] = useState("");
    const [message, setMessage] = useState(""); // For displaying messages to the user


    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const requestData = { dateOfBirth, gender, weight, height, activityLevel, userId };
            console.log("Sending Data:", requestData); // Log sent data

            const response = await fetch("http://localhost/my-app/src/backend/Profile.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            console.log("🔍 Raw Response:", data); // Log raw response for debugging

            if (data.success) {
                setMessage("Profile updated successfully!");
                console.log("✅ Profile update successful");
                navigate("/SetGoal");

            } else {
                setMessage("Error: " + data.message);
                console.error("❌ Error updating profile:", data.message); // Log detailed error
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("An error occurred while updating the profile.");
        }
    };

    return (
        <div style={styles.container}>
            <h2>Profile</h2>
            {message && <p style={styles.message}>{message}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <input type="date" placeholder="Date of Birth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} style={styles.input} />
                <select value={gender} onChange={(e) => setGender(e.target.value)} style={styles.input}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} style={styles.input} />
                <input type="number" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)} style={styles.input} />
                <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} style={styles.input}>
                    <option value="">Select Activity Level</option>
                    <option value="low">Light Active</option>
                    <option value="medium">Moderate</option>
                    <option value="high">High Active</option>
                </select>
                <button type="submit" style={styles.button}>Update Profile</button>
            </form>
        </div>
    );
};

const styles = {
    container: { textAlign: "center", padding: "20px" },
    form: { display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px", margin: "auto" },
    input: { width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" },
    button: { padding: "10px", backgroundColor: "blue", color: "white", borderRadius: "5px", cursor: "pointer" },
    message: { color: "green", fontSize: "14px" }
};

export default Profile;
