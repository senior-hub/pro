<<<<<<< HEAD
import { useApp } from "../context/AppContext";
import React, { useState, useEffect } from "react";

const ShowFavorite = () => {
  
  const [favorites, setFavorites] = useState([]); // Store fetched exercises
  const { navigate, userId, theme, toggleTheme } = useApp();

  // ✅ Format Image URL Helper
  const formatImageUrl = (imgSrc) => `http://localhost${imgSrc.trim().replace(/\\/g, "/")}`;


  // ✅ Convert Arrays to Readable Strings
  const formatMuscles = (muscles) => {
    if (Array.isArray(muscles)) {
      return muscles.join(", ");
    } else if (typeof muscles === "string") {
      return muscles.split(",").map((m) => m.trim()).join(", ");
    }
    return "N/A";
  };


 
  const toggleHome=()=> {
    navigate("/home");
   };
   const toggleSerach=()=> {
    navigate("/Home/ExerciseFilter");
   };

  // ✅ Fetch Favorite Exercises from API

    
    const fetchFavorites = async () => {
      try {
        const response = await fetch("http://localhost/my-app/src/backend/ShowFavorite.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        });

        const data = await response.json();
        setFavorites(data.exercises || []); // Store exercises in state
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

  useEffect(() => {
    if (userId) {
      fetchFavorites(); // Call fetch function only if userId exists
    }
  }, [userId]);
  
 const toggleFavorite = async (exercise_id) => {
    const action = "remove" ;
    try {
      const response = await fetch("http://localhost/my-app/src/backend/favorite.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, id: exercise_id, action }),
      });
      console.error("Error:", action, exercise_id, userId);

      const data = await response.json();
      if (data.success) {

        const newStatus = "false";
        localStorage.setItem(`favorite_${exercise_id}`, newStatus.toString());
      } else {
        console.error(data.message);
      }
       // ✅ Re-fetch favorites after successful submission
       fetchFavorites();
    } catch (error) {
      console.error("Error:", error);
    }
  };
 

  return (
    
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      <button onClick={toggleHome}>Home</button>
      <button onClick={toggleSerach}>back to search</button>

      

      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>Your Favorite Exercises</h2>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
        {favorites.length > 0 ? (

          favorites
          .filter((key) => key !== "Instructions" ) 
          .map((exercise, index) => (
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
            >


              {/* ✅ Display Exercise Image */}
              {exercise.images && (
                <img
                  src={formatImageUrl(
                    Array.isArray(exercise.images) ? exercise.images[0] : exercise.images.split(",")[0]
                  )}
                  alt={`Exercise ${exercise.name}`}
                  style={{ width: "100%", height: "200px", objectFit: "cover", borderBottom: "2px solid #ddd" }}
                />
              )}



              {/* ✅ Exercise Details */}
              <div style={{ padding: "15px"}}>
                <h3 style={{ fontSize: "1.5rem", color: "#333", marginBottom: "10px" }}>{exercise.name}</h3>
                <p style={{ fontSize: "0.8rem", color: "#666" }}>
                <strong>Level:</strong> {exercise.level}
                </p>
                <p style={{ fontSize: "0.8rem", color: "#666" }}>
                <strong>Category:</strong> {exercise.category}
                </p>
                <p style={{ fontSize: "0.8rem", color: "#666" }}>
                  <strong>Force:</strong> {exercise.force}
                </p>
                <p style={{ fontSize: "0.8rem", color: "#666" }}>
                <strong>Mechanic:</strong> {exercise.mechanic}
                </p>
                <p style={{ fontSize: "0.8rem", color: "#666" }}>
                  <strong>Equipment:</strong> {exercise.equipment}
                </p>
                <p style={{ fontSize: "0.8rem", color: "#666" }}>
                  <strong>Primary Muscles:</strong> {formatMuscles(exercise.primaryMuscles)}
                </p>
                <p style={{ fontSize: "0.8rem", color: "#666" }}>
                  <strong>Secondary Muscles:</strong> {formatMuscles(exercise.secondaryMuscles)}
                </p>
    
              </div>
  {/* Handle Instructions Separately */}
  {exercise.instructions && (
    <div style={{ marginTop: "10px" }}>
      <h3 style={{ fontWeight: "bold", marginBottom: "5px" }}>Instructions:</h3>
      <ol style={{ paddingLeft: "20px" }}>

        
        {(Array.isArray(exercise.instructions) ? exercise.instructions : JSON.parse(exercise.instructions))
          .map((step, index) => {
            if (step.includes("Tip:")) {
              const [beforeTip, tipText] = step.split("Tip:"); // Split step into normal text and Tip part
              return (
                <li key={index} style={{ marginBottom: "5px" }}>
                  {beforeTip.trim()}
                  <br />
                  <strong>Tip: {tipText.trim()}</strong>
                </li>
              );
            }
            return <li key={index} style={{ marginBottom: "5px" }}>{step}</li>;
          })}
      </ol>
    </div>
  )}

{/* end of instructions  */}
<button onClick={()=>toggleFavorite(exercise.id)}>remove</button>
            </div>
          ))
        ) : (
          <p style={{ color: "#666", padding: "20px", textAlign: "center" }}>No favorite exercises found.</p>
        )}
      </div>
    </div>
  );
};

export default ShowFavorite;
=======
import { useApp } from "../context/AppContext";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "../style/ShowFavorite.css";

const ShowFavorite = () => {
  const [favorites, setFavorites] = useState([]);
  const { navigate, userId } = useApp();

  // Format Image URL Helper
  const formatImageUrl = (imgSrc) => `http://localhost${imgSrc.trim().replace(/\\/g, "/")}`;

  // Convert Arrays to Readable Strings
  const formatMuscles = (muscles) => {
    if (Array.isArray(muscles)) {
      return muscles.join(", ");
    } else if (typeof muscles === "string") {
      return muscles.split(",").map((m) => m.trim()).join(", ");
    }
    return "N/A";
  };

  // Fetch Favorite Exercises from API
  const fetchFavorites = async () => {
    try {
      const response = await fetch("http://localhost/my-app/src/backend/ShowFavorite.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });

      const data = await response.json();
      setFavorites(data.exercises || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFavorites();
    }
  }, [userId]);
  
  const toggleFavorite = async (exercise_id) => {
    const action = "remove";
    try {
      const response = await fetch("http://localhost/my-app/src/backend/favorite.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, id: exercise_id, action }),
      });

      const data = await response.json();
      if (data.success) {
        const newStatus = "false";
        localStorage.setItem(`favorite_${exercise_id}`, newStatus.toString());
      } else {
        console.error(data.message);
      }
      // Re-fetch favorites after successful submission
      fetchFavorites();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const navigateToExerciseDetails = (exercise) => {
    navigate("/Home/ExerciseFilter/ExerciseDetails", { state: { exercise } });
  };

  return (
    <div className="page-container">
      <Sidebar />
      
      <div className="with-sidebar">
        <div className="filter-container">
          <div className="navigation-buttons">
            <button className="navigation-button" onClick={() => navigate("/home")}>
              <i className="fas fa-home"></i> Home
            </button>
            <button className="navigation-button" onClick={() => navigate("/Home/ExerciseFilter")}>
              <i className="fas fa-search"></i> Back to Search
            </button>
          </div>

          <h2 className="section-title">Your Favorite Exercises</h2>
          
          {favorites.length > 0 ? (
            <div className="exercises-grid">
              {favorites
                .filter((key) => key !== "Instructions")
                .map((exercise, index) => (
                  <div
                    key={index}
                    className="exercise-card"
                    onClick={() => navigateToExerciseDetails(exercise)}
                  >
                    {exercise.images && (
                      <img
                        src={formatImageUrl(
                          Array.isArray(exercise.images) ? exercise.images[0] : exercise.images.split(",")[0]
                        )}
                        alt={`Exercise ${exercise.name}`}
                        className="card-image"
                      />
                    )}
                    
                    <div className="card-content">
                      <h3 className="card-title">{exercise.name}</h3>
                      
                      <div className="card-details">
                        <p className="card-info"><strong>Level:</strong> {exercise.level}</p>
                        <p className="card-info"><strong>Category:</strong> {exercise.category}</p>
                        <p className="card-info"><strong>Force:</strong> {exercise.force}</p>
                        <p className="card-info"><strong>Mechanic:</strong> {exercise.mechanic}</p>
                        <p className="card-info"><strong>Equipment:</strong> {exercise.equipment}</p>
                        <p className="card-info"><strong>Primary Muscles:</strong> {formatMuscles(exercise.primaryMuscles)}</p>
                        <p className="card-info"><strong>Secondary Muscles:</strong> {formatMuscles(exercise.secondaryMuscles)}</p>
                      </div>
                      
                      <button 
                        className="favorite-button remove-favorite" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(exercise.id);
                        }}
                      >
                        <i className="fas fa-heart"></i> Remove from Favorites
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-heart-broken empty-icon"></i>
              <p>No favorite exercises found.</p>
              <button 
                className="navigation-button" 
                onClick={() => navigate("/Home/ExerciseFilter")}
              >
                Browse Exercises
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowFavorite;
>>>>>>> copy-enhanced-ui-chatbot-changes
