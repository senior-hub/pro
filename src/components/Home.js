import React, { useState } from "react";
import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

const Home = () => {
    return (
        <div style={styles.container}>
            <Sidebar />
            <main style={styles.mainContent}>
                <HeroSection />
                <div style={styles.splitContainer}>
                
                    <div style={styles.smallSection}>
                        <IconWithDescription icon="fas fa-bullseye" description="ANALYZE YOUR GOAL" />
                    
                        <IconWithDescription icon="fas fa-dumbbell" description="WORK HARD ON IT " />
                        <IconWithDescription icon="fas fa-trophy" description="ACHIEVE YOUR DESTINY" />
                    </div>



                    <div style={styles.largeSection}>
                       
                       <div style={styles.part}>
                           <h1 color="darkorange" >About Us</h1>
                           Welcome to GlowFit, a fitness program designed to inspire you to be your best self. We offer diverse exercises for all levels, focusing on strength, flexibility, and mental well-being. Join us and transform your lifestyle with GlowFit.
                       </div>
                       <div style={styles.part}>
                           <img src="/70.png" alt="Part 3" style={styles.partImage} /> 
                       </div>
                   </div>









                    <div style={styles.lastSection}>

                    <h2>Follow Us</h2>
                    <div style={styles.socialIcons}>
            <i className="fab fa-facebook-f" style={styles.socialIcon}></i>
            <i className="fab fa-twitter" style={styles.socialIcon}></i>
            <i className="fab fa-instagram" style={styles.socialIcon}></i>
            <i className="fab fa-linkedin-in" style={styles.socialIcon}></i>
        </div>
        <p>Thank you for visiting GlowFit!</p>


                    </div>
                </div>
            </main>
        </div>
    );
};

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

const IconWithDescription = ({ icon, description }) => (
    <div style={styles.iconWithDescription}>
        <i className={icon} style={styles.iconLarge}></i>
        <p style={styles.iconDescription}>{description}</p>
    </div>
);

// Inline styles
const styles = {
    container: { display: "flex", height: "100vh", width: "100vw", backgroundColor: "black" },
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
        color: "green" 
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
        color: "green",
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
    smallSection: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        padding: "30px",
        borderRadius: "1px",
        marginBottom: "0px",
        width:"auto",
        hight:"150px",
  
     
    },
    
lastSection:{

    textAlign: "center",
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "black",
    borderRadius: "0px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
    ,
    color:"white",
    marginTop: "0px",
},

largeSection: {
    flex: 3,
    display: "flex",
    justifyContent: "center", // Center images horizontally
    alignItems: "flex-start", // Align images to the top
    backgroundColor: "#f9f9f9", 
    width: "100%",
    padding: "0px",
    marginBottom: "0px",
    hight:"6px",


},

part: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "10px",
    backgroundColor: "#f9f9f9", // Background color for each part
    padding: "55px",
    borderRadius: "0px",
    width: "10%",
    height: "60%",
    margin: "5px",
    color: "black", // Change text color to orange
},

partImage: {
    maxWidth: "250px",
    maxHeight: "200px", // Increased height
    width: "auto",
    height: "auto",
},
image: {
    maxWidth: "100px",
    maxHeight: "30px", // Increased height
    width: "auto",
    height: "auto",
},



socialIcon: {
    fontSize: "24px",
    color: "white",
    transition: "color 0.3s, transform 0.3s",
    cursor: "pointer"
},



socialIcons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "10px",
},
    h1: {
        color: "orange ", // Change h1 color to white
    },
    partHeader: {
        fontSize: "2px",
        marginBottom: "5px",
    
    },
    partImage: {
        maxWidth: "350px",
        maxHeight: "300px", // Increased height
        width: "auto",
        height: "auto",
    },
    iconWithDescription: {
        display: "flex",
        flexDirection: "column",
    alignItems:"center", 
color:"black",},


    image: {
        maxWidth: "350px",
        maxHeight: "350px", // Increased height
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