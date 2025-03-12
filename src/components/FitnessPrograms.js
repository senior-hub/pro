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
