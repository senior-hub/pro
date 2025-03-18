import { useApp } from "../context/AppContext";
import React, { useState, useEffect } from "react";
  
const HeroSection = () => (
  <section style={{ ...styles.hero, backgroundImage: 'url("/asas.png")' }}>
    <h1 style={styles.heroTitle}>Welcome to GlowFit</h1>
    <p style={styles.heroSubtitle}>Achieve your fitness goals with us</p>
  </section>
);

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

  const toggleHome = () => {
    navigate("/home");
  };
  const toggleSearch = () => {
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
      // ✅ Re-fetch favorites after successful submission
      fetchFavorites();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={styles.container}>
      <HeroSection /> {/* Add HeroSection here */}
      <div style={styles.buttonContainer}>
        <button onClick={toggleHome} style={styles.button}>Home</button>
        <button onClick={toggleSearch} style={styles.button}>Back to Search</button>
      </div>

      <h2 style={styles.title}>Your Favorite Exercises</h2>
      <div style={styles.exercisesContainer}>
        {favorites.length > 0 ? (
          favorites
            .filter((key) => key !== "Instructions")
            .map((exercise, index) => (
              <div key={index} style={styles.exerciseCard}>
                {/* ✅ Display Exercise Image */}
                {exercise.images && (
                  <img
                    src={formatImageUrl(
                      Array.isArray(exercise.images) ? exercise.images[0] : exercise.images.split(",")[0]
                    )}
                    alt={`Exercise ${exercise.name}`}
                    style={styles.exerciseImage}
                  />
                )}

                {/* ✅ Exercise Details */}
                <div style={styles.exerciseDetails}>
                  <h3 style={styles.exerciseName}>{exercise.name}</h3>
                  <p style={styles.exerciseInfo}><strong>Level:</strong> {exercise.level}</p>
                  <p style={styles.exerciseInfo}><strong>Category:</strong> {exercise.category}</p>
                  <p style={styles.exerciseInfo}><strong>Force:</strong> {exercise.force}</p>
                  <p style={styles.exerciseInfo}><strong>Mechanic:</strong> {exercise.mechanic}</p>
                  <p style={styles.exerciseInfo}><strong>Equipment:</strong> {exercise.equipment}</p>
                  <p style={styles.exerciseInfo}><strong>Primary Muscles:</strong> {formatMuscles(exercise.primaryMuscles)}</p>
                  <p style={styles.exerciseInfo}><strong>Secondary Muscles:</strong> {formatMuscles(exercise.secondaryMuscles)}</p>
                </div>

                {/* Handle Instructions Separately */}
                {exercise.instructions && (
                  <div style={styles.instructions}>
                    <h3 style={styles.instructionsTitle}>Instructions:</h3>
                    <ol style={styles.instructionsList}>
                      {(Array.isArray(exercise.instructions) ? exercise.instructions : JSON.parse(exercise.instructions))
                        .map((step, index) => {
                          if (step.includes("Tip:")) {
                            const [beforeTip, tipText] = step.split("Tip:"); // Split step into normal text and Tip part
                            return (
                              <li key={index} style={styles.instructionStep}>
                                {beforeTip.trim()}
                                <br />
                                <strong>Tip: {tipText.trim()}</strong>
                              </li>
                            );
                          }
                          return <li key={index} style={styles.instructionStep}>{step}</li>;
                        })}
                    </ol>
                  </div>
                )}

                <button onClick={() => toggleFavorite(exercise.id)} style={styles.removeButton}>Remove</button>
              </div>
            ))
        ) : (
          <p style={styles.noFavorites}>No favorite exercises found.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "2000px",
    hight:"auto",
    
    marginTop: "0px"
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "green ",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s"
  },
  buttonHover: {
    backgroundColor: "#0056b3"
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px"
  },
  exercisesContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px"
  },
  exerciseCard: {
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
    cursor: "pointer"
  },
  exerciseImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderBottom: "2px solid #ddd"
  },
  exerciseDetails: {
    padding: "15px"
  },
  exerciseName: {
    fontSize: "1.5rem",
    color: "#333",
    marginBottom: "10px"
  },
  exerciseInfo: {
    fontSize: "0.8rem",
    color: "#666"
  },
  instructions: {
    marginTop: "10px"
  },
  instructionsTitle: {
    fontWeight: "bold",
    marginBottom: "5px"
  },
  instructionsList: {
    paddingLeft: "20px"
  },
  instructionStep: {
    marginBottom: "5px"
  },
  removeButton: {
    padding: "10px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s"
  },
  noFavorites: {
    color: "#666",
    padding: "20px",
    textAlign: "center"
  },
  hero: {
    height: '300px',
    width:'1250px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textAlign: 'center',
    marginBottom: '50px',
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





};

export default ShowFavorite;
