import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../style/Sidebar.css";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    
    // Define navigation items
    const navItems = [
        { path: "/home", icon: "fas fa-home", label: "Home" },
        { path: "/home/ExerciseFilter", icon: "fa-solid fa-magnifying-glass", label: "Exercise Search" },
        { path: "/Home/ShowFavorite", icon: "fa-solid fa-heart", label: "Favorites" },
        { path: "/Home/FitnessPrograms", icon: "fas fa-dumbbell", label: "Workout Plan" },
        { path: "/nutrition", icon: "fas fa-apple-alt", label: "Nutrition Plan" },
        { path: "/Home/ChatBot", icon: "fas fa-robot", label: "AI Fitness" },
        { path: "/profile", icon: "fas fa-user", label: "Profile" }
    ];
    
    // Check if path is active
    const isActive = (path) => {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    return (
        <aside 
            className={`sidebar ${isOpen ? 'sidebar-expanded' : ''}`}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div className="brand-logo">
                <img src="/logo-small.png" alt="GlowFit" className="logo-image" />
                <h2 className={`brand-name ${isOpen ? 'visible' : 'hidden'}`}>GlowFit</h2>
            </div>
            
            <nav>
                <ul className="menu">
                    {navItems.map((item, index) => (
                        <li key={index} className="menu-item">
                            <Link 
                                to={item.path} 
                                className={`menu-link ${isActive(item.path) ? 'menu-link-active' : ''}`}
                            >
                                <i className={`${item.icon} menu-icon`}></i>
                                <span className={`menu-label ${isOpen ? 'visible' : 'hidden'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;