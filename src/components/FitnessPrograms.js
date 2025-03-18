import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from './Sidebar'; // Import the Sidebar component

const HeroSection = () => (
  <section style={{ ...styles.hero, backgroundImage: 'url("/asas.png")' }}>
    <h1 style={styles.heroTitle}>Welcome to GlowFit</h1>
    <p style={styles.heroSubtitle}>Achieve your fitness goals with us</p>
  </section>
);

const FitnessPrograms = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null); // Single hover state for efficiency

  useEffect(() => {
    axios
      .get("http://localhost/my-app/src/backend/FitnessPrograms.php") // Adjust backend URL
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Get unique levels dynamically
  const levels = [...new Set(data.map((item) => item.level))];

  return (
    <div style={styles.container}>
      <Sidebar /> {/* Add Sidebar component */}
      <div style={styles.mainContent}>
        <HeroSection /> {/* Add HeroSection component */}
        <div style={styles.content}>
          {levels.map((level) => (
            <div key={level} style={styles.levelContainer}>
              <h2 style={styles.levelTitle}>{level} Programs</h2>
              <div style={styles.list}>
                {data
                  .filter((item) => item.level === level) // Group programs by level dynamically
                  .map((item, index) => (
                    <div
                      key={item.program_name}
                      style={{
                        ...styles.card,
                        ...(hoveredIndex === `${level}-${index}` ? styles.cardHover : {}),
                      }}
                      onMouseEnter={() => setHoveredIndex(`${level}-${index}`)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => navigate("/Home/FitnessPrograms/ProgramDetails", { state: { program_name: item.program_name } })}
                    >
                      {item.program_name}
                    </div>
                  ))}
              </div>
            </div>
          ))}
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
    </div>
  );
};

// Styling
const styles = {
  container: {
    display: "flex",
    flexDirection: "row", // Change to row to accommodate sidebar
    backgroundColor: "white", // background for the page
    padding: "20px",
    height: "100vh", // Full height
  },
  mainContent: {
    flex: 1, // Take remaining space
    marginLeft: "20px", // Add margin to separate from sidebar
    display: "flex",
    flexDirection: "column",
  },
  hero: {
    height: '190vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textAlign: 'center',
   
    padding:'70px',
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
  content: {
    flex: 1, // Take remaining space
    backgroundColor: "#fff", // White background for content box
    padding: "20px",
    borderRadius: "0px",
    boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
  },
  levelContainer: {
    marginBottom: "0px",
  },
  levelTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
    borderBottom: "2px solid #e0e0e0", // Add a bottom border for separation
    paddingBottom: "8px",
    color:"green",
  },
  list: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    padding: 0,
    listStyle: "none",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    minWidth: "150px",
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  cardHover: {
    backgroundColor: "#e0f7fa",
    transform: "scale(1.05)",
    boxShadow: "0px 6px 12px rgba(0,0,0,0.2)",
  },
  lastSection: {
    textAlign: "center",
    marginTop: "10px",
    padding: "0px",
    marginTop:"1px",
    backgroundColor: "black",
    borderRadius: "0px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    color: "white",
  },
  socialIcon: {
    fontSize: "24px",
    color: "white",
    transition: "color 0.3s, transform 0.3s",
    cursor: "pointer",
  },
  socialIcons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "10px",
  },
};

export default FitnessPrograms;