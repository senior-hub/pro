import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from './Sidebar'; // Import the Sidebar component

const ExerciseDetails = () => {
  const { userId } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const exercise = location.state?.exercise || {}; // Prevent undefined
  const id = exercise.id || ""; // Ensure id is always available

  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    const favoriteStatus = localStorage.getItem(`favorite_${id}`);
    if (favoriteStatus === "true") {
      setIsFavorite(true);
    }
    else {
      setIsFavorite(false); // Default to false if not found
    }
  }, [id]); // Runs once when component mounts or when `id` changes

  // Fetch favorite status from backend when component mounts
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!userId || !id) return;

      try {
        const response = await fetch(`http://localhost/my-app/src/backend/ShowFavorite.php?user_id=${userId}&id=${id}`);
        const data = await response.json();

        if (data.success) {
          const newStatus = "true";
          setIsFavorite(newStatus);
          localStorage.setItem(`favorite_${id}`, newStatus.toString()); // Store new status
        }
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    fetchFavoriteStatus();
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

  // Navigate to Search Page
  const toggleSearch = () => {
    navigate("/Home/ExerciseFilter");
  };

  if (!exercise) {
    return <p style={{ padding: "20px", textAlign: "center", fontSize: "18px" }}>No exercise details found.</p>;
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar /> {/* Add the Sidebar component here */}
      <div style={{ padding: '30px', textAlign: 'center', maxWidth: '1220px', margin: 'auto', marginLeft: '80px' }}>
        <div style={{ textAlign: 'left', padding: '20px', fontSize: '16px', color: '#333', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#f9f9f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button onClick={toggleSearch} style={{ backgroundColor: 'green', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Back to Search</button>
            <button onClick={toggleFavorite} style={{ backgroundColor: isFavorite ? 'red' : 'red', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
              {isFavorite ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
            </button>
            <button onClick={handleShowFavorites} style={{ backgroundColor: 'green', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>View Favorites</button>
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 'bold', textAlign: 'center', color: 'green', marginBottom: '20px' }}>{exercise.name}</h2>

          {exercise.images && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
              {(Array.isArray(exercise.images) ? exercise.images : exercise.images.split(","))
                .map((imgSrc, index) => {
                  const fullImageUrl = `http://localhost${imgSrc.trim().replace(/\\/g, "/")}`; // Ensure correct formatting

                  return (
                    <img
                      key={index}
                      src={fullImageUrl}
                      alt={exercise.name}
                      style={{ width: '300px', height: '300px', objectFit: 'cover', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                    />
                  );
                })}
            </div>
          )}

          {Object.keys(exercise)
            .filter((key) => key !== "id" && key !== "instructions" && key !== "images" && key !== "name") // Exclude 'id' and handle 'instructions' separately
            .map((key, index) => (
              <p key={index} style={{ marginBottom: '10px' }}>
                <strong>{key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:</strong> {Array.isArray(exercise[key]) ? exercise[key].join(", ") : exercise[key]}
              </p>
            ))}

          {exercise.instructions && (
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: '10px',color:'green'}}>Instructions:</h3>
              <ol style={{ paddingLeft: '20px' }}>
                {(Array.isArray(exercise.instructions) ? exercise.instructions : JSON.parse(exercise.instructions))
                  .map((step, index) => {
                    if (step.includes("Tip:")) {
                      const [beforeTip, tipText] = step.split("Tip:"); // Split step into normal text and Tip part
                      return (
                        <li key={index} style={{ marginBottom: '10px' }}>
                          {beforeTip.trim()}
                          <br />
                          <strong>Tip: {tipText.trim()}</strong>
                        </li>
                      );
                    }
                    return <li key={index} style={{ marginBottom: '10px' }}>{step}</li>;
                  })}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetails;