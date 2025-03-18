import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; 
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

const HeroSection = () => (
    <section style={{ ...styles.hero, backgroundImage: 'url("/asas.png")' }}>
        <h1 style={styles.heroTitle}>Welcome to GlowFit</h1>
        <p style={styles.heroSubtitle}>Achieve your fitness goals with us</p>
    </section>
);

function Profile() {
    const navigate = useNavigate();
    const userId = sessionStorage.getItem("userId");

    useEffect(() => {
        const loggedIn = sessionStorage.getItem("loggedIn");

        if (!loggedIn) {
            navigate("/login");
        }
    }, [navigate]);

    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState("");
    const [weight, setWeight] = useState(0);
    const [height, setHeight] = useState(0);
    const [activityLevel, setActivityLevel] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const requestData = { dateOfBirth, gender, weight, height, activityLevel, userId };
            console.log("Sending Data:", requestData);

            const response = await fetch("http://localhost/my-app/src/backend/Profile.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            console.log("🔍 Raw Response:", data);

            if (data.success) {
                setMessage("Profile updated successfully!");
                console.log("✅ Profile update successful");
                navigate("/SetGoal");
            } else {
                setMessage("Error: " + data.message);
                console.error("❌ Error updating profile:", data.message);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("An error occurred while updating the profile.");
        }
    };

    return (
        <div style={styles.container}>
            <Sidebar />
            <div style={styles.mainContent}>
                <HeroSection />
                <section style={styles.profileSection}>
                    <h2 style={styles.header}><i className="fas fa-user" style={styles.icon}></i> Profile</h2>
                    {message && <p style={styles.message}>{message}</p>}
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Date of Birth:</label>
                            <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Gender:</label>
                            <select value={gender} onChange={(e) => setGender(e.target.value)} style={styles.input}>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Weight (kg):</label>
                            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Height (cm):</label>
                            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Activity Level:</label>
                            <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)} style={styles.input}>
                                <option value="">Select Activity Level</option>
                                <option value="low">Light Active</option>
                                <option value="medium">Moderate</option>
                                <option value="high">High Active</option>
                            </select>
                        </div>
                        <button type="submit" style={styles.button}>Update Profile</button>
                    </form>
                </section>
                <section style={styles.lastSection}>
                    <h2 style={styles.lastSectionText}>Follow Us</h2>
                    <div style={styles.socialIcons}>
                        <i className="fab fa-facebook-f" style={styles.socialIcon}></i>
                        <i className="fab fa-twitter" style={styles.socialIcon}></i>
                        <i className="fab fa-instagram" style={styles.socialIcon}></i>
                        <i className="fab fa-linkedin-in" style={styles.socialIcon}></i>
                    </div>
                    <p style={styles.lastSectionText}>Thank you for visiting GlowFit!</p>
                </section>
            </div>
        </div>
    );
};

const styles = {
    container: { display: "flex", height: "100vh", backgroundColor: "white" },
    mainContent: { flex: 1, textAlign: "center", padding: "20px", overflowY: "auto" },
    form: { display: "flex", flexDirection: "column", gap: "20px", maxWidth: "600px", margin: "auto", backgroundColor: "#fff", padding: "30px", borderRadius: "10px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" },
    inputGroup: { display: "flex", flexDirection: "column", alignItems: "flex-start" },
    label: { marginBottom: "5px", fontWeight: "bold", color: "black" },
    input: { width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", color: "black" },
    button: { padding: "15px", backgroundColor: "green", color: "white", borderRadius: "5px", cursor: "pointer", border: "none", fontSize: "16px" },
    message: { color: "green", fontSize: "14px" },
    hero: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "300px", color: "white", backgroundSize: "cover", backgroundPosition: "center" },
    heroTitle: { fontSize: "36px", margin: "0" },
    heroSubtitle: { fontSize: "18px", margin: "10px 0" },
    profileSection: { padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "10px", marginTop: "0px" },
    lastSection: { padding: "20px", backgroundColor: "black", borderRadius: "0px", marginTop: "0px", textAlign: "center" },
    lastSectionText: { color: "white" },
    socialIcons: { display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px" },
    socialIcon: { fontSize: "24px", cursor: "pointer", color: "white" },
    icon: { marginRight: "10px", color: "green" },
    header: { color: "green" }
};

export default Profile;