import { useState } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { useApp } from "../context/AppContext";
=======
import { Link } from 'react-router-dom';
import { useApp } from "../context/AppContext";
import Cookies from "js-cookie";
import "../style/Global.css";
>>>>>>> copy-enhanced-ui-chatbot-changes

const SignUp = () => {
    const { setUserId, setLoggedIn } = useApp();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [emailError, setEmailError] = useState("");
<<<<<<< HEAD
    const [validemailError, vaildsetEmailError] = useState("");
    const Navigate = useNavigate();
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [NameError, setNameError] = useState("");

=======
    const [validEmailError, setValidEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [nameError, setNameError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
>>>>>>> copy-enhanced-ui-chatbot-changes

    const handleSubmit = async (e) => {
        e.preventDefault();
        sessionStorage.clear();
    
        setMessage("");
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");
<<<<<<< HEAD
        vaildsetEmailError("");
    
        let valid = true;
    
=======
        setValidEmailError("");
        setNameError("");
    
        let valid = true;
    
        if (!name.trim()) {
            setNameError("Name is required");
            valid = false;
        }
        
>>>>>>> copy-enhanced-ui-chatbot-changes
        if (!email.trim()) {
            setEmailError("Email is required");
            valid = false;
        }
<<<<<<< HEAD
=======
        
        if (!password.trim()) {
            setPasswordError("Password is required");
            valid = false;
        }
        
>>>>>>> copy-enhanced-ui-chatbot-changes
        if (!confirmPassword.trim()) {
            setConfirmPasswordError("Confirm Password is required");
            valid = false;
        }
<<<<<<< HEAD
=======
        
>>>>>>> copy-enhanced-ui-chatbot-changes
        if (!valid) return;
    
        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            return;
        }
    
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/.test(password)) {
            setPasswordError("Password must be 8-15 characters long, include uppercase, lowercase, a number, and a special character.");
            return;
        }
    
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setEmailError("Invalid email format");
            return;
        }
    
<<<<<<< HEAD
        // ✅ Log request data before sending
        console.log("Sending request with data:", { email, password, confirmPassword });
    
        try {
            const requestData = { email, password, confirmPassword };
=======
        console.log("Sending request with data:", { name, email, password, confirmPassword });
    
        try {
            const requestData = { name, email, password, confirmPassword };
>>>>>>> copy-enhanced-ui-chatbot-changes
            const response = await fetch("http://localhost/my-app/src/backend/SignUp.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });
    
            const text = await response.text();
<<<<<<< HEAD
    
            // ✅ Log response text to check if server is responding
=======
>>>>>>> copy-enhanced-ui-chatbot-changes
            console.log("Server Response Text:", text);
    
            try {
                const data = JSON.parse(text);
                console.log("Parsed JSON Response:", data);
    
                if (!data.success) {
                    if (data.message.includes("Password")) {
                        setPasswordError(data.message);
                    } else if (data.message.includes("match")) {
                        setConfirmPasswordError(data.message);
                    } else if (data.message.includes("Invalid email format")) {
                        setEmailError(data.message);
                    } else if (data.message.includes("Email already exists")) {
<<<<<<< HEAD
                        vaildsetEmailError(data.message);
=======
                        setValidEmailError(data.message);
>>>>>>> copy-enhanced-ui-chatbot-changes
                    } else {
                        setMessage(data.message);
                    }
                } else {
                    setMessage("✅ Signup successfully!");
    
<<<<<<< HEAD
                    sessionStorage.clear();
=======
                    Cookies.set("userId", data.userId, { expires: 1 });
                    Cookies.set("loggedIn", true, { expires: 1 });
    
>>>>>>> copy-enhanced-ui-chatbot-changes
                    sessionStorage.setItem("loggedIn", true);
                    sessionStorage.setItem("userId", data.userId);
    
                    setUserId(data.userId);
                    setLoggedIn(true);
    
<<<<<<< HEAD
                    setTimeout(() => Navigate("/Profile"), 2000);
=======
                    setTimeout(() => navigate("/Profile"), 2000);
>>>>>>> copy-enhanced-ui-chatbot-changes
                }
            } catch (error) {
                console.error("JSON Parse Error:", error);
                console.error("Server Response:", text);
                setMessage("Error processing server response.");
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            setMessage("Network error: Could not connect to server.");
        }
    };
<<<<<<< HEAD
    
    return (
        <div style={styles.pageContainer}>
            <div style={styles.container}>
                <div style={styles.imageContainer}>
                    <img src="99.png" alt="Sign Up" style={styles.image} />
                </div>
                <div style={styles.formContainer}>
                    <h2 style={styles.title}>Sign Up</h2>
                    {message && <p style={styles.message}>{message}</p>}

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputContainer}>
                            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} />
                            {NameError && <p style={styles.error}>{NameError}</p>}
                        </div>

                        <div style={styles.inputContainer}>
                            <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
                            {emailError && <p style={styles.error}>{emailError}</p>}
                            {validemailError && <p style={styles.error}>{validemailError}</p>}
                        </div>

                        <div style={styles.inputContainer}>
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
                            <p style={styles.instruction}>Password must be 8-15 characters long, include uppercase, lowercase, a number, and a special character (@.#$!%*?&).</p>
                            {passwordError && <p style={styles.error}>{passwordError}</p>}
                        </div>

                        <div style={styles.inputContainer}>
                            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={styles.input} />
                            {confirmPasswordError && <p style={styles.error}>{confirmPasswordError}</p>}
                        </div>
                        <button type="submit" style={styles.button}>Sign Up</button>
=======

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    
    return (
        <div className="page-container">
            <div className="auth-container">
                <div className="image-container">
                    <img src="99.png" alt="Sign Up" />
                </div>
                <div className="form-container">
                    <h2 className="form-title">Sign Up</h2>
                    {message && <p className="success-message">{message}</p>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <input 
                                type="text" 
                                placeholder="Name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                className="form-input" 
                            />
                            {nameError && <p className="error-message">{nameError}</p>}
                        </div>

                        <div className="input-group">
                            <input 
                                type="text" 
                                placeholder="Email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="form-input" 
                            />
                            {emailError && <p className="error-message">{emailError}</p>}
                            {validEmailError && <p className="error-message">{validEmailError}</p>}
                        </div>

                        <div className="input-group">
                            <div className="password-input-wrapper">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className="form-input" 
                                />
                                <button 
                                    type="button" 
                                    className="password-toggle"
                                    onClick={togglePasswordVisibility}
                                    tabIndex="-1"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <p className="instruction-text">Password must be 8-15 characters long, include uppercase, lowercase, a number, and a special character (@.#$!%*?&).</p>
                            {passwordError && <p className="error-message">{passwordError}</p>}
                        </div>

                        <div className="input-group">
                            <div className="password-input-wrapper">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    className="form-input" 
                                />
                                <button 
                                    type="button" 
                                    className="password-toggle"
                                    onClick={toggleConfirmPasswordVisibility}
                                    tabIndex="-1"
                                >
                                    {showConfirmPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
                        </div>
                        
                        <button type="submit" className="submit-button">Sign Up</button>
                        
                        <div className="link-container">
                            Already have an account? <Link to="/login" className="auth-link">Login</Link>
                        </div>
>>>>>>> copy-enhanced-ui-chatbot-changes
                    </form>
                </div>
            </div>
        </div>
    );
};

<<<<<<< HEAD
const styles = {
    pageContainer: { backgroundColor: "WHITE", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" },
    container: { display: "flex", justifyContent: "center", alignItems: "center", padding: "40px", maxWidth: "700px", margin: "auto", border: "1px solid #ccc", borderRadius: "40px", boxShadow: "0 0 10px #ccc" },
    imageContainer: { flex: "1", marginRight: "20px" },
    image: { width: "100%", borderRadius: "10px" },
    formContainer: { flex: "1", textAlign: "center" },
    title: { color: "darkorange" },
    form: { display: "flex", flexDirection: "column", gap: "10px", padding: "10px" },
    inputContainer: { textAlign: "left" },
    input: { width: "100%", padding: "5px", borderRadius: "19px", border: "1px solid #ccc" },
    button: { padding: "10px", backgroundColor: "darkorange", color: "white", borderRadius: "5px", cursor: "pointer", border: "none" },
    error: { color: "red", fontSize: "12px", marginTop: "5px" },
    message: { color: "green", fontSize: "13px" },
    instruction: { fontSize: "10px", color: "gray", marginTop: "5px" }
    
};

export default SignUp;



 
=======
export default SignUp;
>>>>>>> copy-enhanced-ui-chatbot-changes
