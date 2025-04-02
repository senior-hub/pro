import React, { useState } from "react";
<<<<<<< HEAD
import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

const Home = () => {
    return (
        <div style={styles.container}>
            <Sidebar />
            <main style={styles.mainContent}>
                <HeroSection />
                <div style={styles.splitContainer}>
                    <div style={styles.largeSection}>
                        <div style={styles.part}>
                            <img src="/ex2.png" alt="Part 1" style={styles.partImage} />
                        </div>
                        <div style={styles.part}>
                            <h1 color="darkorange" >About Us</h1>
                            Welcome to GlowFit, a fitness program designed to inspire you to be your best self. We offer diverse exercises for all levels, focusing on strength, flexibility, and mental well-being. Join us and transform your lifestyle with GlowFit.
                        </div>
                        <div style={styles.part}>
                            <img src="/70.png" alt="Part 3" style={styles.partImage} /> 
                        </div>
                    </div>
                </div>
=======
import { useNavigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../style/Home.css";
import Sidebar from "./Sidebar";

const Home = () => {
    const navigate = useNavigate();
    
    const handleGetStarted = () => {
        navigate("/signup");
    };

    return (
        <div className="home-container">
            <Sidebar />
            
            <main className="main-content with-sidebar">
                {/* Hero Section */}
                <section className="hero" style={{ backgroundImage: 'url("/asas.png")' }}>
                    <div className="hero-content">
                        <h1 className="hero-title">Welcome to GlowFit</h1>
                        <p className="hero-subtitle">Achieve your fitness goals with us</p>
                        <button className="hero-button" onClick={handleGetStarted}>Get Started</button>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features-section">
                    <h2 className="section-title">Why Choose GlowFit</h2>
                    
                    <div className="features-container">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-dumbbell"></i>
                            </div>
                            <h3 className="feature-title">Personalized Workouts</h3>
                            <p className="feature-text">
                                Custom exercise plans tailored to your fitness level, goals, and available equipment.
                            </p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-apple-alt"></i>
                            </div>
                            <h3 className="feature-title">Nutrition Guidance</h3>
                            <p className="feature-text">
                                Expert nutrition advice and meal plans that complement your workout routine.
                            </p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <h3 className="feature-title">Track Progress</h3>
                            <p className="feature-text">
                                Monitor your improvements with detailed statistics and progress tracking.
                            </p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-robot"></i>
                            </div>
                            <h3 className="feature-title">AI Fitness Coach</h3>
                            <p className="feature-text">
                                Get instant advice and motivation from our AI-powered fitness assistant.
                            </p>
                        </div>
                    </div>
                </section>
                
                {/* About Section */}
                <section className="content-section">
                    <h2 className="section-title">About Us</h2>
                    <div className="about-container">
                        <div className="content-part">
                            <img src="/ex2.png" alt="Fitness" className="part-image" />
                        </div>
                        <div className="content-part">
                            <p className="part-text">
                                Welcome to GlowFit, a fitness program designed to inspire you to be your best self. 
                                We offer diverse exercises for all levels, focusing on strength, flexibility, and 
                                mental well-being. Join us and transform your lifestyle with GlowFit.
                            </p>
                        </div>
                        <div className="content-part">
                            <img src="/70.png" alt="Fitness Journey" className="part-image" />
                        </div>
                    </div>
                </section>
                
                {/* Testimonials Section */}
                <section className="testimonials-section">
                    <h2 className="section-title">What Our Users Say</h2>
                    
                    <div className="testimonials-container">
                        <div className="testimonial-card">
                            <div className="testimonial-content">
                                <i className="fas fa-quote-left quote-icon"></i>
                                <p>
                                    GlowFit has completely transformed my approach to fitness. The personalized workouts 
                                    and nutrition guidance helped me lose 30 pounds in just 6 months!
                                </p>
                            </div>
                            <div className="testimonial-author">
                                <div className="author-avatar">
                                    <i className="fas fa-user"></i>
                                </div>
                                <div className="author-info">
                                    <h4>Sarah Johnson</h4>
                                    <p>Member since 2022</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="testimonial-card">
                            <div className="testimonial-content">
                                <i className="fas fa-quote-left quote-icon"></i>
                                <p>
                                    As someone who always struggled with consistency, the AI coach feature has been 
                                    a game-changer. I've never stuck with a fitness program this long before!
                                </p>
                            </div>
                            <div className="testimonial-author">
                                <div className="author-avatar">
                                    <i className="fas fa-user"></i>
                                </div>
                                <div className="author-info">
                                    <h4>Michael Thomas</h4>
                                    <p>Member since 2023</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Call to Action Section */}
                <section className="cta-section">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Start Your Fitness Journey?</h2>
                        <p className="cta-text">
                            Join GlowFit today and take the first step toward a healthier, stronger you.
                        </p>
                        <button className="cta-button" onClick={handleGetStarted}>
                            Start Now
                        </button>
                    </div>
                </section>
                
                {/* Footer */}
                <footer className="home-footer">
                    <div className="footer-content">
                        <div className="footer-logo">
                            <h3>GlowFit</h3>
                            <p>Your path to fitness excellence</p>
                        </div>
                        
                        <div className="footer-links">
                            <div className="footer-column">
                                <h4>Quick Links</h4>
                                <ul>
                                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/home"); }}>Home</a></li>
                                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/Home/ExerciseFilter"); }}>Exercises</a></li>
                                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/Home/FitnessPrograms"); }}>Programs</a></li>
                                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/Home/ChatBot"); }}>AI Coach</a></li>
                                </ul>
                            </div>
                            
                            <div className="footer-column">
                                <h4>Connect</h4>
                                <div className="social-icons">
                                    <a href="#" onClick={(e) => e.preventDefault()}><i className="fab fa-facebook-f"></i></a>
                                    <a href="#" onClick={(e) => e.preventDefault()}><i className="fab fa-instagram"></i></a>
                                    <a href="#" onClick={(e) => e.preventDefault()}><i className="fab fa-twitter"></i></a>
                                    <a href="#" onClick={(e) => e.preventDefault()}><i className="fab fa-youtube"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="footer-bottom">
                        <p>&copy; {new Date().getFullYear()} GlowFit. All rights reserved.</p>
                    </div>
                </footer>
>>>>>>> copy-enhanced-ui-chatbot-changes
            </main>
        </div>
    );
};

<<<<<<< HEAD
const HeroSection = () => (
    <section style={{ ...styles.hero, backgroundImage: 'url("/asas.png")' }}>
        <h1 style={styles.heroTitle}>Welcome to GlowFit</h1>
        <p style={styles.heroSubtitle}>Achieve your fitness goals with us</p>
        <button style={styles.heroButton}>Get Started</button>
    </section>
);

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [clickedItem, setClickedItem] = useState(null);

    return (
        <aside 
            style={{ ...styles.sidebar, width: isOpen ? styles.sidebarHover.width : styles.sidebar.width }}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <nav>
                <ul style={styles.menu}>
                    <MenuItem to="/home" icon="fas fa-home" label="Home" isOpen={isOpen} clickedItem={clickedItem} setClickedItem={setClickedItem} />
                    <MenuItem to="/home/ExerciseFilter"icon="fa-solid fa-magnifying-glass" label="Exercise Search" isOpen={isOpen} clickedItem={clickedItem} setClickedItem={setClickedItem} />
                    <MenuItem to="/Home/ShowFavorite"  icon="fa-solid fa-heart" label="Favorites" isOpen={isOpen} clickedItem={clickedItem} setClickedItem={setClickedItem} />
                    <MenuItem to="/Home/FitnessPrograms" icon="fas fa-dumbbell"  label="Workout Plan" isOpen={isOpen} clickedItem={clickedItem} setClickedItem={setClickedItem} />
                    <MenuItem to="/nutrition" icon="fas fa-apple-alt" label="Nutrition Plan" isOpen={isOpen} clickedItem={clickedItem} setClickedItem={setClickedItem} />
                    
                    {/* ✅ Link AI Fitness to ChatBot.js */}
                    <MenuItem to="/Home/ChatBot" icon="fas fa-robot" label="AI Fitness" isOpen={isOpen} clickedItem={clickedItem} setClickedItem={setClickedItem} />
                    
                    <MenuItem to="/profile" icon="fas fa-user" label="Profile" isOpen={isOpen} clickedItem={clickedItem} setClickedItem={setClickedItem} />
                </ul>
            </nav>
        </aside>
    );
};


const MenuItem = ({ to, icon, label, isOpen, clickedItem, setClickedItem }) => {
    const handleClick = () => {
        setClickedItem(label);
    };

    return (
        <li style={styles.menuItem}>
            <Link 
                to={to} 
                style={{ 
                    ...styles.link, 
                    color: clickedItem === label ? 'red' : 'gray' 
                }}
                onClick={handleClick}
            >
                <i className={icon} style={styles.icon}></i> {isOpen && label}
            </Link>
        </li>
    );
};

// Inline styles
const styles = {
    container: { display: "flex", height: "100vh", width: "100vw", backgroundColor: "black" },
    sidebar: { 
        width: "40px",
        height: "100%", 
        backgroundColor: "black", 
        padding: "15px",
        boxSizing: "border-box",
        color: "RGB(233,233,2333)",
        overflow: "hidden",
        borderRadius: "5px 0 0px 5px",
        transition: "width .75s ease-out",
    },
    sidebarHover: {
        width: "200px",
    },
    menu: { listStyleType: "none", padding: 0 },
    menuItem: { 
        margin: "20px 0", 
        display: "flex", 
        alignItems: "center" // Ensure icons and text are vertically centered
    },
    link: { 
        color: "white", 
        textDecoration: "none", 
        fontSize: "15px", // Reduced font size
        display: "flex",
        alignItems: "center",
        fontFamily: "'Arial', sans-serif", // Change font family
        transition: "black 0.3s ease", // Add transition for smooth color change
    },
    linkHover: {
        color: "orange", // Change text color to red on hover
    },
    icon: { 
        marginRight: "15px",
        color: "darkorange" 
    },
    mainContent: { flex: 1, padding: "0", display: "flex", flexDirection: "column" },
    hero: {
        backgroundColor: "#f5f5f5",
        backgroundImage: 'url("/new.png")', // Add your image URL here
        backgroundSize: "cover", // Ensure the image covers the entire section
        backgroundPosition: "center", // Center the image
        padding: "50px 20px",
        textAlign: "center",
        color: "#fff", // Change text color to white for better contrast
    },
    heroTitle: {
        fontSize: "2.5em",
        margin: "0 0 20px",
        color: "RGB(233,233,233)", // Ensure the text is readable over the background image
    },
    heroSubtitle: {
        fontSize: "1.2em",
        margin: "0 0 20px",
        color: "RGB(233,233,233)", // Ensure the text is readable over the background image
    },
    heroButton: {
        padding: "10px 20px",
        fontSize: "1em",
        color: "ORANGE",
        backgroundColor: "RGB(233,233,233)",
        border: "none",
        borderRadius: "20px",
        cursor: "pointer",
    },
    splitContainer: {
        display: "flex",
        flexDirection: "column",
        height: "90%",
        width: "99%",
    },
    largeSection: {
        flex: 3,
        display: "flex",
        justifyContent: "center", // Center images horizontally
        alignItems: "flex-start", // Align images to the top
        backgroundColor: "white", 
        width: "100%",
        padding: "0px",
        marginBottom: "100px",
        hight:"100px",
    },
    part: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "10px",
        backgroundColor: "rgb(233,233,233)", // Background color for each part
        padding: "40px",
        borderRadius: "10px",
        width: "10%",
        height: "60%",
        margin: "5px",
        color: "black", // Change text color to orange
    },
    h1: {
        color: "orange ", // Change h1 color to white
    },
    partHeader: {
        fontSize: "2px",
        marginBottom: "5px",
        color: "maroon" // Change color to maroon
    },
    partImage: {
        maxWidth: "350px",
        maxHeight: "200px", // Increased height
        width: "auto",
        height: "auto",
    },
    image: {
        maxWidth: "450px",
        maxHeight: "150px", // Increased height
        width: "auto",
        height: "auto",
    }
};

const App = () => {
    return (
        <div style={styles.container}>
            <Home />
        </div>
    );
};

export default App;
=======
export default Home;
>>>>>>> copy-enhanced-ui-chatbot-changes
