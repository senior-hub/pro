import React, { useState } from "react";
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
            </main>
        </div>
    );
};

export default Home;