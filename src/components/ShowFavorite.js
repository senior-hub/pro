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
