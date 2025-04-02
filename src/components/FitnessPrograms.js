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
