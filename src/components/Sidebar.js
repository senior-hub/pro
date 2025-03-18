import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

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
                    <MenuItem to="/home/ExerciseFilter" icon="fa-solid fa-magnifying-glass" label="Exercise Search" isOpen={isOpen} clickedItem={clickedItem} setClickedItem={setClickedItem} />
                    <MenuItem to="/Home/ShowFavorite" icon="fa-solid fa-heart" label="Favorites" isOpen={isOpen} clickedItem={clickedItem} setClickedItem={setClickedItem} />
                    <MenuItem to="/Home/FitnessPrograms" icon="fas fa-dumbbell" label="Workout Plan" isOpen={isOpen} clickedItem={clickedItem} setClickedItem={setClickedItem} />
                    <MenuItem to="/nutrition" icon="fas fa-apple-alt" label="Nutrition Plan" isOpen={isOpen} clickedItem={clickedItem} setClickedItem={setClickedItem} />
                    <MenuItem to="/fitness" icon="fas fa-heartbeat" label="AI Fitness" isOpen={isOpen} clickedItem={clickedItem} setClickedItem={setClickedItem} />
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

const styles = {
    sidebar: { 
        width: "40px",
        height: "100%", 
        backgroundColor: "white", 
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
        alignItems: "center" 
    },
    link: { 
        color: "white", 
        textDecoration: "none", 
        fontSize: "15px", 
        display: "flex",
        alignItems: "center",
        fontFamily: "'Arial', sans-serif", 
        transition: "black 0.3s ease", 
    },
    icon: { 
        marginRight: "15px",
        color: "green" 
    },
};

export default Sidebar;