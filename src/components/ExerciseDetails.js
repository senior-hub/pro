import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "../style/ExerciseDetails.css";
import Sidebar from "./Sidebar";

const ExerciseDetails = () => {
  const { userId } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const exercise = location.state?.exercise || {}; // Prevent undefined
  const id = exercise.id || ""; // Ensure id is always available  const { userId } = useApp();
  

  
 
  // Fetch favorite status from backend when component mounts
  useEffect(() => {
    
    const fetchFavoriteStatus = async () => {
      
      if (!userId || !id) return;

      try {
          const response = await fetch("http://localhost/my-app/src/backend/ShowFavorite.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId }),
          });      
          const data = await response.json();

        if (data.success) {  
          const searchId = id;
          const foundExercise = data.exercises.find(exercise => String(exercise.id) === String(searchId));

          console.log(`true`);
              console.log(data.exercises);
              console.log(id);
              if (foundExercise) {
                console.log("Found exercise:", foundExercise);
                setIsFavorite(true);

              } else {
                console.log("Exercise not found");
                setIsFavorite(false);

              }
        } else {
          console.log(`false`);
        }
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    fetchFavoriteStatus();
  }, [userId, id]);

  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {

    const favoriteStatus = localStorage.getItem(`favorite_${id}`);
    if (favoriteStatus === "true") {
      setIsFavorite(true);
    }
    else {
      setIsFavorite(false); // Default to false if not found
    }
  }, [userId, id]);
   

  // Toggle Favorite Status (Add/Remove from Backend & LocalStorage)
  const toggleFavorite = async () => {
    if (!userId) {
      console.warn("User not logged in.");
      return;
    }

    const action = isFavorite ? "remove" : "add";
    // Toggle favorite state
    const newStatus = !isFavorite;
    setIsFavorite(newStatus);
    localStorage.setItem(`favorite_${id}`, newStatus.toString()); // Store new status

    try {
      const response = await fetch("http://localhost/my-app/src/backend/favorite.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, id: id, action }),
      });

      const data = await response.json();

      if (data.success) {
        const newStatus = !isFavorite;
        setIsFavorite(newStatus); // Toggle state
        localStorage.setItem(`favorite_${id}`, newStatus.toString()); // Store as "true" or "false"
      } else {
        console.error("Failed to update favorite:", data.message);
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };


  // Navigate to Favorites Page
  const handleShowFavorites = () => {
    navigate("/Home/ShowFavorite");
  };
  
  // Navigate back to Exercise Search
  const handleBackToSearch = () => {
    navigate("/Home/ExerciseFilter");
  };

  if (!exercise || Object.keys(exercise).length === 0) {
    return (
      <div className="page-container">
        <Sidebar />
        <div className="with-sidebar error-message">No exercise details found.</div>
      </div>
    );
  }

  // Format image URLs
  const getFormattedImages = () => {
    if (!exercise.images) return [];
    
    const imageArray = Array.isArray(exercise.images) 
      ? exercise.images 
      : exercise.images.split(",");
      
    return imageArray.map(img => 
      `http://localhost${img.trim().replace(/\\/g, "/")}`
    );
  };

  // Parse instructions if needed
  const getInstructions = () => {
    if (!exercise.instructions) return [];
    
    return Array.isArray(exercise.instructions) 
      ? exercise.instructions 
      : JSON.parse(exercise.instructions);
  };

  // Get exercise details excluding certain fields
  const getExerciseDetails = () => {
    return Object.entries(exercise).filter(([key]) => 
      !['id', 'instructions', 'images', 'name'].includes(key)
    );
  };

  return (
    <div className="page-container">
      <Sidebar />
      
      <div className="details-container with-sidebar">
        <button className="navigation-button" onClick={handleBackToSearch}>
          <i className="fas fa-arrow-left"></i> Back to Search
        </button>

        <h2 className="exercise-title">{exercise.name}</h2>

        {/* Images Gallery */}
        {exercise.images && (
          <div className="images-container">
            {getFormattedImages().map((imgSrc, index) => (
              <img
                key={index}
                src={imgSrc}
                alt={`${exercise.name} - view ${index + 1}`}
                className="exercise-image"
              />
            ))}
          </div>
        )}

        {/* Exercise Details */}
        <div className="details-section">
          <div className="details-grid">
            {getExerciseDetails().map(([key, value], index) => (
              <div key={index} className="detail-item">
                <span className="detail-label">
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                </span>
                <div className="detail-value">
                  {Array.isArray(value) ? value.join(", ") : value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions Section */}
        {exercise.instructions && (
          <div className="instructions-section">
            <h3 className="instructions-title">Instructions</h3>
            <ol className="instructions-list">
              {getInstructions().map((step, index) => {
                if (step.includes("Tip:")) {
                  const [beforeTip, tipText] = step.split("Tip:");
                  return (
                    <li key={index} className="instruction-step">
                      {beforeTip.trim()}
                      <div className="instruction-tip">
                        <strong>Tip:</strong> {tipText.trim()}
                      </div>
                    </li>
                  );
                }
                return <li key={index} className="instruction-step">{step}</li>;
              })}
            </ol>
          </div>
        )}

        {/* Action Buttons */}
        <div className="actions-container">
          <button className="favorite-button" onClick={toggleFavorite}>
            {isFavorite ? (
              <>❤️ Remove from Favorites</>
            ) : (
              <>🤍 Add to Favorites</>
            )}
          </button>

          <button className="favorites-button" onClick={handleShowFavorites}>
            View All Favorites
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetails;
