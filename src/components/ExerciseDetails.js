import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const ExerciseDetails = () => {
  const { userId } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const exercise = location.state?.exercise || {}; // Prevent undefined
  const id = exercise.id || ""; // Ensure id is always available

  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    const storedFavorite = localStorage.getItem(`favorite_${id}`);
    setIsFavorite(storedFavorite === "true"); // If "true", set true, else false
  }, [id]); // Runs once when component mounts or when `id` changes

  // ✅ Fetch favorite status from backend when component mounts
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!userId || !id) return;

      try {
        const response = await fetch(`http://localhost/my-app/src/backend/ShowFavorite.php?user_id=${userId}&id=${id}`);
        const data = await response.json();

        if (data.success) {
          const newStatus = !isFavorite;
          setIsFavorite(newStatus);
          localStorage.setItem(`favorite_${id}`, newStatus.toString()); // Store new status
        }
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    fetchFavoriteStatus();
  }, [userId, id]);

  // ✅ Toggle Favorite Status (Add/Remove from Backend & LocalStorage)
  const toggleFavorite = async () => {
    if (!userId) {
      console.warn("User not logged in.");
      return;
    }

    const action = isFavorite ? "remove" : "add";
     // ✅ Toggle favorite state
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
        setIsFavorite(newStatus); // ✅ Toggle state
        localStorage.setItem(`favorite_${id}`, newStatus.toString()); // ✅ Store as "true" or "false"
      } else {
        console.error("Failed to update favorite:", data.message);
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };


  // ✅ Navigate to Favorites Page
  const handleShowFavorites = () => {
    navigate("/Home/ShowFavorite");
  };
 // ✅ Navigate to Favorites Page
 const toggleSerach = () => {
  navigate("/Home/ExerciseFilter");
};
  if (!exercise) {
    return <p style={{ padding: "20px", textAlign: "center", fontSize: "18px" }}>No exercise details found.</p>;
  }


  
  return (
    <div style={{ padding: "20px", textAlign: "center", maxWidth: "600px", margin: "auto" }}>
            <button onClick={toggleSerach}>back to search</button>

      <h2 style={{ fontSize: "24px", fontWeight: "bold" }}> {exercise.name}</h2>

      {exercise.images && (
  <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
    {(Array.isArray(exercise.images) ? exercise.images : exercise.images.split(","))
      .map((imgSrc, index) => {
        const fullImageUrl = `http://localhost${imgSrc.trim().replace(/\\/g, "/")}`; // Ensure correct formatting

        return (
          <img
            key={index}
            src={fullImageUrl}
            alt={exercise.name}
            style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "10px" }}
          />
        );
        
        
      })}
  </div>
)}

{/* Display all details dynamically */}
<div style={{ textAlign: "left", padding: "10px", fontSize: "16px", color: "#333" }}>
  {Object.keys(exercise)
    .filter((key) => key !== "id" && key !== "instructions" && key!== "images"&& key!== "name") // Exclude 'id' and handle 'instructions' separately
    .map((key, index) => (
      <p key={index} style={{ marginBottom: "5px" }}>
        <strong>{key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:</strong> 
        {Array.isArray(exercise[key]) ? exercise[key].join(", ") : exercise[key]}
      </p>
    ))}

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
</div>

  
      {/* ✅ Favorite Button */}
      <button onClick={toggleFavorite} style={{ marginRight: "10px" }}>
        {isFavorite ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
      </button>

      {/* ✅ Show Favorites Button */}
      <button onClick={handleShowFavorites}>View Favorites</button>


      
    </div>
  );
};

export default ExerciseDetails;
