import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ProgramDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { program_name } = location.state || { program_name: "No Program Provided" };

  const [programDetails, setProgramDetails] = useState([]);
  const [error, setError] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseStates, setExerciseStates] = useState({});
  const [currentDayExercises, setCurrentDayExercises] = useState([]);
  const [exerciseDetails, setExerciseDetails] = useState(null);

  useEffect(() => {
    if (program_name !== "No Program Provided") {
      fetch("http://localhost/my-app/src/backend/Program.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ program_name }),
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProgramDetails(data.data);
        } else {
          setError(data.message || "Error retrieving data");
        }
      })
      .catch(() => setError("Failed to fetch program details"));
    }
  }, [program_name]);

  useEffect(() => {
    if (selectedWeek !== null && selectedDay !== null) {
      const filteredExercises = programDetails.filter(
        exercise => exercise.week === selectedWeek && exercise.day === selectedDay
      );
      setCurrentDayExercises(filteredExercises);
      setCurrentExerciseIndex(filteredExercises.length > 0 ? 0 : null);
    } else {
      setCurrentDayExercises([]);
      setCurrentExerciseIndex(null);
    }
  }, [selectedWeek, selectedDay, programDetails]);

  useEffect(() => {
    if (currentDayExercises.length > 0 && currentExerciseIndex < currentDayExercises.length) {
      const exerciseId = currentDayExercises[currentExerciseIndex]?.exercise_id;
      if (!exerciseId) return;

      fetch(`http://localhost/my-app/src/backend/fetchExercise.php?id=${exerciseId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.details) {
            setExerciseDetails(data.details);
          } else {
            setExerciseDetails(null);
          }
        })
        .catch(() => setExerciseDetails(null));
    }
  }, [currentExerciseIndex, currentDayExercises]);

  const handleCompleteSet = () => {
    if (!currentDayExercises.length) return;

    const currentExercise = currentDayExercises[currentExerciseIndex];
    const completedSets = exerciseStates[currentExercise.exercise_id] || 0;

    if (completedSets < (currentExercise.sets || 0) - 1) {
      setExerciseStates(prev => ({
        ...prev,
        [currentExercise.exercise_id]: completedSets + 1,
      }));
    } else {
      setExerciseStates(prev => ({
        ...prev,
        [currentExercise.exercise_id]: 0,
      }));

      if (currentExerciseIndex < currentDayExercises.length - 1) {
        setCurrentExerciseIndex(prevIndex => prevIndex + 1);
      } else {
        alert("Workout Completed! Well done! 🎉");
        setCurrentExerciseIndex(0);
        setExerciseStates({});
      }
    }
  };

  // Navigate to Home
  const handleShowFavorites = () => {
    navigate("/Home");
  };

  // Navigate to FitnessPrograms
  const toggleSearch = () => {
    navigate("/Home/FitnessPrograms");
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <button style={styles.button} onClick={handleShowFavorites}>Home</button>
        <button style={styles.button} onClick={toggleSearch}>Fitness Programs</button>
        
        <h1>Program: {program_name}</h1>
        {error && <p style={styles.errorMessage}>{error}</p>}

        <nav style={styles.weekNav}>
          {Array.from(new Set(programDetails.map(workout => workout.week))).map(week => (
            <button key={week} style={styles.button} onClick={() => {
              setSelectedWeek(week);
              setSelectedDay(null);
              setCurrentDayExercises([]);
              setCurrentExerciseIndex(0);
            }}>
              Week {week}
            </button>
          ))}
        </nav>

        {selectedWeek !== null && (
          <nav style={styles.dayNav}>
            {Array.from(new Set(programDetails.filter(workout => workout.week === selectedWeek).map(workout => workout.day))).map(day => (
              <button key={day} style={styles.button} onClick={() => {
                setSelectedDay(day);
                setCurrentExerciseIndex(0);
              }}>
                Day {day}
              </button>
            ))}
          </nav>
        )}

        {selectedWeek !== null && selectedDay !== null && currentDayExercises.length > 0 && currentExerciseIndex !== null ? (
          <div style={styles.exerciseDetails}>
            <h2>Exercise {currentExerciseIndex + 1}: {currentDayExercises[currentExerciseIndex]?.exercise_id?.replace(/_/g, " ")}</h2>
            <p>Sets: {Array.from({ length: currentDayExercises[currentExerciseIndex]?.sets || 0 }, (_, i) => (
              <span key={i}>
                {((exerciseStates[currentDayExercises[currentExerciseIndex]?.exercise_id] || 0) > i) ? "●" : "○"}
              </span>
            ))} ({exerciseStates[currentDayExercises[currentExerciseIndex]?.exercise_id] || 0}/{currentDayExercises[currentExerciseIndex]?.sets})</p>
            <p><strong>Duration/Reps:</strong> {currentDayExercises[currentExerciseIndex]?.reps}</p>
            <p><strong>Rest:</strong> {currentDayExercises[currentExerciseIndex]?.rest_time}</p>
            <button style={styles.button} onClick={handleCompleteSet}>Set Completed</button>
          </div>
        ) : (
          <p>Select a week/day to view exercises.</p>
        )}

        {exerciseDetails ? (
          <div style={styles.exerciseInfo}>
            <h2>{exerciseDetails.name}</h2>
            {exerciseDetails.images && (
              <div style={styles.imageGallery}>
                {(Array.isArray(exerciseDetails.images) ? exerciseDetails.images : exerciseDetails.images.split(","))
                  .map((imgSrc, index) => {
                    const fullImageUrl = `http://localhost${imgSrc.trim().replace(/\\/g, "/")}`;
                    return (
                      <img key={index} src={fullImageUrl} alt={exerciseDetails.name} style={styles.image} />
                    );
                  })}
              </div>
            )}
            <div style={styles.detailsList}>
              {Object.keys(exerciseDetails)
                .filter(key => !["id", "instructions", "images", "name"].includes(key))
                .map((key, index) => (
                  <p key={index}>
                    <strong>{key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}:</strong>
                    {Array.isArray(exerciseDetails[key]) ? exerciseDetails[key].join(", ") : exerciseDetails[key]}
                  </p>
                ))}
            </div>
            {exerciseDetails.instructions && (
              <div style={styles.instructions}>
                <h3>Instructions:</h3>
                <ol>
                  {(Array.isArray(exerciseDetails.instructions) ? exerciseDetails.instructions : JSON.parse(exerciseDetails.instructions))
                    .map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                </ol>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    maxWidth: "990px",
    margin: "auto",
    textAlign: "center",
  },
  box: {
    border: "1px solid #ddd",
    borderRadius: "20px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  errorMessage: {
    color: "red",
  },
  weekNav: {
    margin: "20px 0",
  },
  dayNav: {
    margin: "20px 0",
  },
  button: {
    margin: "5px",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "green",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.2s",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  exerciseDetails: {
    marginTop: "20px",
    textAlign: "left",
  },
  exerciseInfo: {
    marginTop: "20px",
    textAlign: "left",
  },
  imageGallery: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  image: {
    width: "190px",
    height: "190px",
    objectFit: "cover",
    borderRadius: "10px",
  },
  detailsList: {
    padding: "10px",
    fontSize: "16px",
    color: "#333",
  },
  instructions: {
    marginTop: "10px",
  },
};

export default ProgramDetails;
