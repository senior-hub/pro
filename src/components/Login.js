import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirection
import { Link } from 'react-router-dom';
import { useApp } from "../context/AppContext";

const Login = () => {
    const { setUserId, setLoggedIn } = useApp();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // Hook to handle redirection

    const handleLogin = async (e) => {
        e.preventDefault();

           // Clear old session data
           sessionStorage.clear();

        let valid = true;

        // Reset error messages
        setEmailError("");
        setPasswordError("");
        setMessage("");

        // Validation checks
        if (!email.trim()) {
            setEmailError("Email is required");
            valid = false;
        }
        if (!password.trim()) {
            setPasswordError("Password is required");
            valid = false;
        }

        if (!valid) return; // Stop if fields are missing

        console.log("🔍 Fetching login data...");
        try {
            const response = await fetch("http://localhost/my-app/src/backend/Login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            console.log("🔍 Login Fetch Response:", response);

            const text = await response.text();
            console.log("🔍 Raw Response:", text);

            if (!text.trim()) {
                console.error("❌ Server returned an empty response.");
                setMessage("Server error: No response received.");
                return;
            }

            const data = JSON.parse(text);
            console.log("✅ Parsed Login Response:", data);

            if (data.success) {
                setMessage("Login successfully!");

                sessionStorage.setItem("loggedIn", true);
                sessionStorage.setItem("userId", data.userId);
                 // ✅ Update AppContext
                 setUserId(data.userId);
                 setLoggedIn(true);

                // Redirect based on role
                if (data.role === "admin") {
                    navigate("/AdminHome");
                } else {
                    navigate("/Home");
                }
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error("❌ Fetch or JSON Parse Error:", error);
            setMessage("Error processing server response.");
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.container}>
                <div style={styles.imageContainer}>
                    <img src="80.png" alt="Login" style={styles.image} />
                </div>
                <div style={styles.formContainer}>
                    <h2 style={styles.title}>Login</h2>
                    {message && <p style={styles.message}>{message}</p>}
                    <form onSubmit={handleLogin} style={styles.form}>
                        <div style={styles.inputContainer}>
                            <input
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={styles.input}
                            />
                            {emailError && <p style={styles.error}>{emailError}</p>}
                        </div>
                        <div style={styles.inputContainer}>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={styles.input}
                            />
                            {passwordError && <p style={styles.error}>{passwordError}</p>}
                        </div>
                        <button type="submit" style={styles.button}>Login</button>
                        <p style={{ marginTop: '10px' }}>
                            Don't have an account? <Link to="/signup">Sign up</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Inline styles
const styles = {
    pageContainer: { backgroundColor: "#f9f9f9", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" },
    container: { display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", maxWidth: "800px", margin: "auto", border: "1px solid #ccc", borderRadius: "10px", boxShadow: "0 0 20px rgba(0,0,0,0.1)" },
    imageContainer: { flex: "1", marginRight: "20px" },
    image: { width: "100%", borderRadius: "10px" },
    formContainer: { flex: "1", textAlign: "center" },
    title: { color: "green" },
    form: { display: "flex", flexDirection: "column", gap: "10px" },
    inputContainer: { textAlign: "left" },
    input: { width: "100%", padding: "5px", borderRadius: "5px", border: "1px solid #ccc" },
    button: { padding: "10px", backgroundColor: "green", color: "white", borderRadius: "5px", cursor: "pointer", border: "none" },
    error: { color: "red", fontSize: "12px", marginTop: "5px" },
    message: { color: "green", fontSize: "14px" }
};

export default Login;