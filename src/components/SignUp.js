import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const SignUp = () => {
    const { setUserId, setLoggedIn } = useApp();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [emailError, setEmailError] = useState("");
    const [validemailError, vaildsetEmailError] = useState("");
    const Navigate = useNavigate();
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [NameError, setNameError] = useState("");


    const handleSubmit = async (e) => {

        e.preventDefault();
            sessionStorage.clear();

        let valid = true;
        if (!email.trim()) {
            setEmailError("Email is required");
            valid = false;
        valid = false;
        }
        if (!confirmPassword.trim()) {
            setConfirmPasswordError("Confirm Password is required");
            valid = false;
        }
        if (!name.trim()) {
            setNameError("Name is required");
            valid = false;
        }

        if (!valid) return;

        setMessage("");
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");
        vaildsetEmailError("");

        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            return;
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/.test(password)) {
            setPasswordError(" ");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setEmailError("Invalid email format");
            return;
        }
        try {
            const requestData = { name, email, password, confirmPassword };
            const response = await fetch("http://localhost/my-app/src/backend/SignUp.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });
    
            const text = await response.text();

            try {
                const data = JSON.parse(text);

                if (!data.success) {
                    if (data.message.includes("Password")) {
                        setPasswordError(data.message);
                    } else if (data.message.includes("match")) {
                        setConfirmPasswordError(data.message);
                    } else if (data.message.includes("Invalid email format")) {
                        setEmailError(data.message);
                    } else if (data.message.includes("Email already exists")) {
                        vaildsetEmailError(data.message);
                    } else {
                        setMessage(data.message);
                    }
                } else {
                    setMessage("✅ Signup successfilly ! ");
                    
                    sessionStorage.clear();
                    sessionStorage.setItem("loggedIn", true);
                    sessionStorage.setItem("userId", data.userId);
                     // ✅ Update AppContext
                        setUserId(data.userId);
                        setLoggedIn(true);
                    setTimeout(() => Navigate("/Profile"), 2000);
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
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageContainer: { backgroundColor: "#f9f9f9", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" },
    container: { display: "flex", justifyContent: "center", alignItems: "center", padding: "50px", maxWidth: "700px", margin: "auto", border: "1px solid #ccc", borderRadius: "30px", boxShadow: "0 0 10px #ccc" ,maxhight: "900px" },
    imageContainer: { flex: "1", marginRight: "20px" },
    image: { width: "100%", borderRadius: "10px" },
    formContainer: { flex: "1", textAlign: "center" },
    title: { color: "green" },
    form: { display: "flex", flexDirection: "column", gap: "10px", padding: "10px" },
    inputContainer: { textAlign: "left" },
    input: { width: "100%", padding: "5px", borderRadius: "19px", border: "1px solid #ccc" },
    button: { padding: "10px", backgroundColor: "green", color: "white", borderRadius: "5px", cursor: "pointer", border: "none" },
    error: { color: "red", fontSize: "12px", marginTop: "5px" },
    message: { color: "green", fontSize: "13px" },
    instruction: { fontSize: "10px", color: "gray", marginTop: "5px" }
    
};

export default SignUp;



 