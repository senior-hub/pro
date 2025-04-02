import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../style/ProgramDetails.css";

function ProgramDetails() {
  const location = useLocation();
  const { program_name } = location.state || { program_name: "No Program Provided" };

  // Program-related states
  const [programDetails, setProgramDetails] = useState([]);
  const [error, setError] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseStates, setExerciseStates] = useState({});

  // Exercise-related states
  const [currentDayExercises, setCurrentDayExercises] = useState([]);
  const [exerciseDetails, setExerciseDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch program details on mount
  useEffect(() => {
    if (program_name !== "No Program Provided") {
      setIsLoading(true);
      console.log(`Fetching program details for: ${program_name}`);

      fetch("http://localhost/my-app/src/backend/Program.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ program_name }),
      })
        .then((res) => res.json())
        .then((data) => {
          setIsLoading(false);
          if (data.success) {
            console.log("Program details received:", data.data);
            setProgramDetails(data.data);
            setSelectedWeek(null);
            setSelectedDay(null);
            setCurrentExerciseIndex(null);
            setExerciseStates({});
          } else {
            console.error("Error retrieving program details:", data.message);
            setError(data.message || "Error retrieving data");
          }
        })
        .catch((err) => {
          setIsLoading(false);
          console.error("Failed to fetch program details", err);
          setError("Failed to fetch program details");
        });
    }
  }, [program_name]);

  // Update exercises when week/day changes
  useEffect(() => {
    if (selectedWeek !== null && selectedDay !== null) {
      const filteredExercises = programDetails.filter(
        (exercise) => exercise.week === selectedWeek && exercise.day === selectedDay
      );

      console.log(`Exercises for Week ${selectedWeek}, Day ${selectedDay}:`, filteredExercises);
      setCurrentDayExercises(filteredExercises);

      // Only reset to first exercise if exercises exist
      if (filteredExercises.length > 0) {
        setCurrentExerciseIndex(0);
      } else {
        setCurrentExerciseIndex(null);
      }
    } else {
      setCurrentDayExercises([]);
      setCurrentExerciseIndex(null);
    }
  }, [selectedWeek, selectedDay, programDetails]);

  // Fetch exercise details when current exercise changes
  useEffect(() => {
    if (currentDayExercises.length > 0 && currentExerciseIndex !== null && currentExerciseIndex < currentDayExercises.length) {
      const exerciseId = currentDayExercises[currentExerciseIndex]?.exercise_id;
      if (!exerciseId) return;

      console.log(`Fetching details for new exercise ID: ${exerciseId}`);
      setIsLoading(true);
      setExerciseDetails(null); // Clear old data while loading

      fetch(`http://localhost/my-app/src/backend/fetchExercise.php?id=${exerciseId}`)
        .then((res) => res.json())
        .then((data) => {
          setIsLoading(false);
          if (data.success && data.details) {
            console.log("✅ New exercise details received:", data.details);
            setExerciseDetails(data.details);
          } else {
            console.error("❌ Error retrieving exercise details or empty response");
            setExerciseDetails(null);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("❌ Error fetching exercise details", error);
          setExerciseDetails(null);
        });
    }
  }, [currentExerciseIndex, currentDayExercises]);

  // Track progress for debugging
  useEffect(() => {
    console.log("Current Exercise Index:", currentExerciseIndex);
    console.log("Exercise States:", exerciseStates);
  }, [exerciseStates, currentExerciseIndex]);

  // Handle completing a set
  const handleCompleteSet = () => {
    if (!currentDayExercises.length) return;

    const currentExercise = currentDayExercises[currentExerciseIndex];
    if (!currentExercise) return;

    const totalSets = currentExercise.sets || 0;
    const completedSets = exerciseStates[currentExercise.exercise_id] || 0;

    if (completedSets < totalSets - 1) {
      // Increase completed sets for this exercise
      setExerciseStates((prev) => ({
        ...prev,
        [currentExercise.exercise_id]: completedSets + 1,
      }));
    } else {
      // Move to next exercise after completing all sets
      setExerciseStates((prev) => ({
        ...prev,
        [currentExercise.exercise_id]: 0,
      }));

      if (currentExerciseIndex < currentDayExercises.length - 1) {
        setCurrentExerciseIndex((prevIndex) => prevIndex + 1);
      } else {
        alert("✅ Workout Completed! Well done! 🎉");
        setCurrentExerciseIndex(0);
        setExerciseStates({});
      }
    }
  };

  // Get unique weeks from program details
  const getUniqueWeeks = () => {
    return Array.from(new Set(programDetails.map((workout) => workout.week)));
  };

  // Get unique days for selected week
  const getUniqueDays = () => {
    if (selectedWeek === null) return [];
    return Array.from(
      new Set(
        programDetails
          .filter((workout) => workout.week === selectedWeek)
          .map((workout) => workout.day)
      )
    );
  };

  // Format exercise name for display
  const formatExerciseName = (name) => {
    if (!name) return "";
    return name.replace(/_/g, " ");
  };

  return (
    <div className="page-container">
      <Sidebar />
      
      <div className="with-sidebar">
        <div className="program-container">
          <h1 className="program-title">
            <i className="fas fa-dumbbell"></i> {program_name}
          </h1>
          
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}
          
          {/* Week Selection */}
          <div className="week-nav">
            {getUniqueWeeks().map((week) => (
              <button
                key={week}
                className={`nav-button ${selectedWeek === week ? 'active' : ''}`}
                onClick={() => {
                  setSelectedWeek(week);
                  setSelectedDay(null);
                  setCurrentDayExercises([]);
                  setCurrentExerciseIndex(0);
                }}
              >
                <i className="fas fa-calendar-week"></i> Week {week}
              </button>
            ))}
          </div>
          
          {/* Day Selection */}
          {selectedWeek !== null && (
            <div className="day-nav">
              {getUniqueDays().map((day) => (
                <button
                  key={day}
                  className={`nav-button ${selectedDay === day ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedDay(day);
                    setCurrentExerciseIndex(0);
                  }}
                >
                  <i className="fas fa-calendar-day"></i> Day {day}
                </button>
              ))}
            </div>
          )}
          
          {/* Current Exercise Display */}
          {selectedWeek !== null && selectedDay !== null && currentDayExercises.length > 0 && currentExerciseIndex !== null ? (
            <div className="exercise-card">
              <h2 className="exercise-title">
                <span className="highlight">Exercise {currentExerciseIndex + 1}:</span> {formatExerciseName(currentDayExercises[currentExerciseIndex]?.exercise_id)}
              </h2>
              
              <div className="sets-container">
                <div className="exercise-detail">
                  Sets: 
                  <div className="set-indicators">
                    {Array.from({ length: currentDayExercises[currentExerciseIndex]?.sets || 0 }, (_, i) => (
                      <span 
                        key={i} 
                        className={`set-dot ${(exerciseStates[currentDayExercises[currentExerciseIndex]?.exercise_id] || 0) > i ? 'complete' : 'incomplete'}`}
                      ></span>
                    ))}
                  </div>
                  <span>
                    ({exerciseStates[currentDayExercises[currentExerciseIndex]?.exercise_id] || 0}/{currentDayExercises[currentExerciseIndex]?.sets})
                  </span>
                </div>
              </div>
              
              <div className="exercise-detail">
                <strong>Duration/Reps:</strong> <span>{currentDayExercises[currentExerciseIndex]?.reps}</span>
              </div>
              
              <div className="exercise-detail">
                <strong>Rest:</strong> <span>{currentDayExercises[currentExerciseIndex]?.rest_time}</span>
              </div>
              
              <button className="complete-button" onClick={handleCompleteSet}>
                <i className="fas fa-check"></i> Set Completed
              </button>
            </div>
          ) : (
            !isLoading && selectedWeek !== null && selectedDay !== null && (
              <div className="empty-state">
                <i className="fas fa-info-circle"></i> No exercises found for this day.
              </div>
            )
          )}
          
          {/* Exercise Details Section */}
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading exercise details...</p>
            </div>
          ) : exerciseDetails ? (
            <div className="exercise-details-container">
              <h2 className="exercise-name">{exerciseDetails.name}</h2>
              
              {/* Exercise Images */}
              {exerciseDetails.images && (
                <div className="images-gallery">
                  {(Array.isArray(exerciseDetails.images) ? exerciseDetails.images : exerciseDetails.images.split(","))
                    .map((imgSrc, index) => {
                      const fullImageUrl = `http://localhost${imgSrc.trim().replace(/\\/g, "/")}`;
                      return (
                        <img
                          key={index}
                          src={fullImageUrl}
                          alt={exerciseDetails.name}
                          className="exercise-image"
                        />
                      );
                    })}
                </div>
              )}
              
              {/* Exercise Details Grid */}
              <div className="details-grid">
                {Object.keys(exerciseDetails)
                  .filter((key) => key !== "id" && key !== "instructions" && key !== "images" && key !== "name")
                  .map((key, index) => (
                    <div key={index} className="detail-item">
                      <div className="detail-label">
                        {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                      </div>
                      <div className="detail-value">
                        {Array.isArray(exerciseDetails[key]) ? exerciseDetails[key].join(", ") : exerciseDetails[key]}
                      </div>
                    </div>
                  ))}
              </div>
              
              {/* Instructions Section */}
              {exerciseDetails.instructions && (
                <div className="instructions-section">
                  <h3 className="instructions-title">Instructions</h3>
                  <ol className="instructions-list">
                    {(Array.isArray(exerciseDetails.instructions) ? exerciseDetails.instructions : JSON.parse(exerciseDetails.instructions))
                      .map((step, index) => {
                        if (step.includes("Tip:")) {
                          const [beforeTip, tipText] = step.split("Tip:");
                          return (
                            <li key={index} className="instruction-step">
                              {beforeTip.trim()}
                              <div className="instruction-tip">
                                <i className="fas fa-lightbulb"></i> Tip: {tipText.trim()}
                              </div>
                            </li>
                          );
                        }
                        return <li key={index} className="instruction-step">{step}</li>;
                      })}
                  </ol>
                </div>
              )}
            </div>
          ) : !isLoading && (selectedWeek === null || selectedDay === null) ? (
            <div className="empty-state">
              <i className="fas fa-hand-point-up"></i> Select a week and day to view your workout
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ProgramDetails;
