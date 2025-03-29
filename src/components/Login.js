import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useApp } from "../context/AppContext";
import Cookies from "js-cookie";
import "../style/Global.css";

const Login = () => {
    const { setUserId, setLoggedIn } = useApp();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        sessionStorage.clear();
    
        let valid = true;
        setEmailError("");
        setPasswordError("");
        setMessage("");
    
        if (!email.trim()) {
            setEmailError("Email is required");
            valid = false;
        }
        if (!password.trim()) {
            setPasswordError("Password is required");
            valid = false;
        }
        if (!valid) return;
    
        try {
            const response = await fetch("http://localhost/my-app/src/backend/Login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });
    
            const data = await response.json();
            console.log("✅ Parsed Login Response:", data);
    
            if (data.success) {
                setMessage("Login successfully!");
    
                Cookies.set("userId", data.userId, { expires: 1 });
                Cookies.set("loggedIn", true, { expires: 1 });
    
                setUserId(data.userId);
                setLoggedIn(true);
    
                navigate(data.role === "admin" ? "/AdminHome" : "/Home");
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error("❌ Fetch Error:", error);
            setMessage("Error processing server response.");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    return (
        <div className="page-container">
            <div className="auth-container">
                <div className="image-container">
                    <img src="80.png" alt="Login" />
                </div>
                <div className="form-container">
                    <h2 className="form-title">Login</h2>
                    {message && <p className="success-message">{message}</p>}
                    
                    <form onSubmit={handleLogin} className="auth-form">
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                            />
                            {emailError && <p className="error-message">{emailError}</p>}
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
                            {passwordError && <p className="error-message">{passwordError}</p>}
                        </div>
                        
                        <button type="submit" className="submit-button">Login</button>
                        
                        <div className="link-container">
                            Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;