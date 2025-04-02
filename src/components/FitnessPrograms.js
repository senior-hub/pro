<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      {levels.map((level) => (
        <div key={level}>
          <h2>{level} Programs</h2>
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
  );
};

// Styling
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f4f4f4",
    padding: "20px",
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
  },
  cardHover: {
    backgroundColor: "lightblue",
    transform: "scale(1.05)",
    boxShadow: "0px 6px 12px rgba(0,0,0,0.2)",
  },
};

export default FitnessPrograms;
=======
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../style/FitnessPrograms.css";

const FitnessPrograms = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get("http://localhost/my-app/src/backend/FitnessPrograms.php");
      setPrograms(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleProgramClick = (programName) => {
    navigate("/Home/FitnessPrograms/ProgramDetails", { 
      state: { program_name: programName } 
    });
  };

  // Get unique levels dynamically
  const levels = programs.length > 0 
    ? [...new Set(programs.map(item => item.level))]
    : [];

  return (
    <div className="page-container">
      <Sidebar />
      
      <div className="with-sidebar">
        <div className="filter-container">
          <h2 className="section-title">Fitness Programs</h2>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading programs...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <p>Error loading programs: {error}</p>
              <button className="navigation-button" onClick={fetchPrograms}>
                Try Again
              </button>
            </div>
          ) : (
            <div className="programs-container">
              {levels.map((level) => (
                <div key={level} className="program-level-section">
                  <h3 className="program-level-title">{level} Programs</h3>
                  
                  <div className="programs-grid">
                    {programs
                      .filter((item) => item.level === level)
                      .map((program, index) => (
                        <div
                          key={`${level}-${index}`}
                          className={`program-card ${activeCard === `${level}-${index}` ? 'program-card-active' : ''}`}
                          onMouseEnter={() => setActiveCard(`${level}-${index}`)}
                          onMouseLeave={() => setActiveCard(null)}
                          onClick={() => handleProgramClick(program.program_name)}
                        >
                          <div className="program-icon">
                            {level === 'Beginner' && <i className="fas fa-seedling"></i>}
                            {level === 'Intermediate' && <i className="fas fa-running"></i>}
                            {level === 'Advanced' && <i className="fas fa-fire"></i>}
                          </div>
                          <h4 className="program-name">{program.program_name}</h4>
                          <div className="program-details">
                            <span className="program-duration">
                              <i className="far fa-clock"></i> 8 weeks
                            </span>
                            <span className="program-sessions">
                              <i className="fas fa-dumbbell"></i> 3-5 sessions/week
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FitnessPrograms;
>>>>>>> copy-enhanced-ui-chatbot-changes
