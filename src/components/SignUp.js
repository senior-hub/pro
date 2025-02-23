import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
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
        

            let valid = true;
            // ✅ Improved validation with correct error assignments
            if (!email.trim()) {
                setEmailError("Email is required");
                valid = false;
            }
            if (!password.trim()) {
                setPasswordError("Password is required");
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



        if (!valid) return; // Stop if fields are missing



            console.log("Submitting form..."); // Debugging: Log message to console

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
            console.log("Sending Data:", requestData); // ✅ Log sent data
            const response = await fetch("http://localhost/my-app/src/backend/SignUp.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });
    
            console.log("Fetch Response:", response); // ✅ Log fetch response object
    
            const text = await response.text();
            console.log("Raw Response:", text); // ✅ Log raw response before parsing
    
            try {
                const data = JSON.parse(text);
                console.log("PHP Response:", data); // ✅ Log parsed JSON

                if (!data.success) {
                    if (data.message.includes("Password")) {
                        setPasswordError(data.message);
                    } else if (data.message.includes("match")) {
                        setConfirmPasswordError(data.message);
                    } else if (data.message.includes("Invalid email format")) {
                        setEmailError(data.message); // ✅ Handle invalid email format
                    } else if (data.message.includes("Email already exists")) {
                        vaildsetEmailError(data.message); // ✅ Handle duplicate email error
                    } else {
                        setMessage(data.message);
                    }


                } else {
                    setMessage("✅ Your account is now ready! Please log in to continue.");
                    setTimeout(() => Navigate("/Profile"), 2000); // ✅ Redirect after 2s


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
        <div style={styles.container}>
            <h2>Sign Up</h2>
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
                    <p style={{ color: passwordError ? "red" : "grey" }}>Password must be 8-15 characters long, include uppercase, lowercase, a number, and a special character (@.#$!%*?&).</p>
                    {passwordError && <p style={styles.error}>{passwordError}</p>}

                </div>





                
                <div style={styles.inputContainer}>
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={styles.input} />
                    {confirmPasswordError && <p style={styles.error}>{confirmPasswordError}</p>}

                </div>
                <button type="submit" style={styles.button}>Sign Up</button>
            </form>
        </div>
    );
};

const styles = {
    container: { textAlign: "center", padding: "20px" },
    form: { display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px", margin: "auto" },
    inputContainer: { textAlign: "left" },
    input: { width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" },
    button: { padding: "10px", backgroundColor: "blue", color: "white", borderRadius: "5px", cursor: "pointer" },
    error: { color: "red", fontSize: "12px", marginTop: "5px" },
    message: { color: "green", fontSize: "14px" },
    instruction: { fontSize: "12px", color: "gray", marginTop: "5px" }
};

export default SignUp;
 