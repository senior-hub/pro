import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ExerciseSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      if (query.length > 0) {
        try {
          const response = await axios.post(
            "http://localhost/my-app/src/backend/ExerciseView.php",
            { name: query },
            { headers: { "Content-Type": "application/json" } }
          );
          setResults(response.data);
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      } else {
        setResults([]);
      }
    };

    const delayDebounceFn = setTimeout(fetchData, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const formatImageUrl = (imgSrc) => `http://localhost${imgSrc.trim().replace(/\\/g, "/")}`;

  // Convert arrays to readable strings
  const formatMuscles = (muscles) => {
    if (Array.isArray(muscles)) {
      return muscles.join(", "); // Join array values with a comma
    } else if (typeof muscles === "string") {
      return muscles.split(",").map(m => m.trim()).join(", "); // Ensure consistent formatting
    }
    return "N/A";
  };

  const handleCardClick = (exercise) => {
    navigate("/Home/ExerciseSearch/ExerciseDetail", { state: { exercise } });
  };
  

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>Search for Exercises</h2>
      <input
        type="text"
        placeholder="Enter exercise name..."
        style={{ width: "100%", maxWidth: "400px", padding: "10px", fontSize: "16px", borderRadius: "5px", border: "2px solid #ddd", marginBottom: "20px", outline: "none" }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
        {results.length > 0 ? (
          results.map((exercise, index) => (
          
              <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "#fff",
                border: "2px solid #ddd",
                borderRadius: "10px",
                boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                width: "300px",
                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                cursor: "pointer",
              }}
              onClick={() => handleCardClick(exercise)} // Send full exercise data
            >
              
            
              {/* Display Exercise Image */}
              {exercise.images && (
                <img
                  src={formatImageUrl(
                    Array.isArray(exercise.images) ? exercise.images[0] : exercise.images.split(",")[0]
                  )}
                  alt={`Exercise ${exercise.name}`}
                  style={{ width: "100%", height: "200px", objectFit: "cover", borderBottom: "2px solid #ddd" }}
                />
              )}

              {/* Exercise Details */}
              <div style={{ padding: "15px", textAlign: "center" }}>
                <h3 style={{ fontSize: "1.5rem", color: "#333", marginBottom: "10px" }}>{exercise.name}</h3>
                <p style={{ fontSize: "1rem", color: "#666" }}>
                  <strong>Primary Muscles:</strong> {formatMuscles(exercise.primaryMuscles)}
                </p>
                <p style={{ fontSize: "1rem", color: "#666" }}>
                  <strong>Secondary Muscles:</strong> {formatMuscles(exercise.secondaryMuscles)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "#666", padding: "20px", textAlign: "center" }}>No matches found.</p>
        )}
      </div>
    </div>
  );
};

export default ExerciseSearch;
