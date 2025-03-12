import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function ProgramDetails() {

  const location = useLocation();
  const { program_name } = location.state || { program_name: "No Program Provided" };

  // ✅ Program-related states
  const [programDetails, setProgramDetails] = useState([]);
  const [error, setError] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseStates, setExerciseStates] = useState({});

  // ✅ Exercise-related states
  const [currentDayExercises, setCurrentDayExercises] = useState([]);
  const [exerciseDetails, setExerciseDetails] = useState(null);






  // ✅ Fetch program details on mount
  useEffect(() => {
    if (program_name !== "No Program Provided") {
      console.log(`Fetching program details for: ${program_name}`);

      fetch("http://localhost/my-app/src/backend/Program.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ program_name }),
      })
        .then((res) => res.json())
        .then((data) => {
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
        .catch(() => {
          console.error("Failed to fetch program details");
          setError("Failed to fetch program details");
        });
    }
  }, [program_name]);





// ✅ Update exercises when week/day changes
useEffect(() => {
  if (selectedWeek !== null && selectedDay !== null) {
    const filteredExercises = programDetails.filter(
      (exercise) => exercise.week === selectedWeek && exercise.day === selectedDay
    );

    console.log(`Exercises for Week ${selectedWeek}, Day ${selectedDay}:`, filteredExercises);
    setCurrentDayExercises(filteredExercises);

    // ✅ Only reset to first exercise if exercises exist
    if (filteredExercises.length > 0) {
      setCurrentExerciseIndex(0);
    } else {
      setCurrentExerciseIndex(null); // ❌ Prevents auto-selection if no exercises exist
    }
  } else {
    setCurrentDayExercises([]); // ✅ Clear exercises if nothing is selected
    setCurrentExerciseIndex(null);
  }
}, [selectedWeek, selectedDay, programDetails]);




  // ✅ Fetch exercise details when current exercise changes
useEffect(() => {
  if (currentDayExercises.length > 0 && currentExerciseIndex < currentDayExercises.length) {
    const exerciseId = currentDayExercises[currentExerciseIndex]?.exercise_id;
    if (!exerciseId) return;

    console.log(`Fetching details for new exercise ID: ${exerciseId}`);

    
    setExerciseDetails(null); // ✅ Clear old data while loading

    fetch(`http://localhost/my-app/src/backend/fetchExercise.php?id=${exerciseId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.details) {
          console.log("✅ New exercise details received:", data.details);
          setExerciseDetails(data.details); // ✅ Sync with new exercise
        } else {
          console.error("❌ Error retrieving exercise details or empty response");
          setExerciseDetails(null);
        }
      })
      .catch((error) => {
        console.error("❌ Error fetching exercise details", error);
                      setExerciseDetails(null);
      })
  }
}, [currentExerciseIndex, currentDayExercises]);


useEffect(() => {
  console.log("Current Exercise Index:", currentExerciseIndex);
  console.log("Exercise States:", exerciseStates);
}, [exerciseStates, currentExerciseIndex]);


const handleCompleteSet = () => {
  if (!currentDayExercises.length) return; // Ensure exercises exist

  const currentExercise = currentDayExercises[currentExerciseIndex]; // Get the current exercise
  if (!currentExercise) return;

  const totalSets = currentExercise.sets || 0;
  const completedSets = exerciseStates[currentExercise.exercise_id] || 0;

  if (completedSets < totalSets - 1) {
    // ✅ Increase completed sets for this exercise
    setExerciseStates((prev) => ({
      ...prev,
      [currentExercise.exercise_id]: completedSets + 1,
    }));
  } else {
    // ✅ Move to next exercise after completing all sets
    setExerciseStates((prev) => ({
      ...prev,
      [currentExercise.exercise_id]: 0,
    }));

    if (currentExerciseIndex < currentDayExercises.length - 1) {
      setCurrentExerciseIndex((prevIndex) => prevIndex + 1); // ✅ Move to next exercise
    } else {
      alert("✅ Workout Completed! Well done! 🎉");
      setCurrentExerciseIndex(0); // ✅ Reset after last exercise
      setExerciseStates({});
    }
  }
};


  
  


  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto", textAlign: "center" }}>
    <h1>Program: {program_name}</h1>
    {error && <p style={{ color: "red" }}>{error}</p>}
  
    {/* ✅ Week Buttons - Updates selectedWeek and resets selectedDay */}
    <nav>
      {Array.from(new Set(programDetails.map((workout) => workout.week))).map((week) => (
        <button 
          key={week} 
          onClick={() => {
            setSelectedWeek(week);
            setSelectedDay(null);
            setCurrentDayExercises([]); // ✅ Clear exercises if nothing is selected
            setCurrentExerciseIndex(0); // Reset exercise index
          }}
        >
          Week {week}
        </button>
      ))}
    </nav>
  
    {/* ✅ Day Buttons - Updates selectedDay and resets exerciseIndex */}
    {selectedWeek !== null && (
      <nav>
        {Array.from(new Set(programDetails.filter((workout) => workout.week === selectedWeek).map((workout) => workout.day))).map((day) => (
          <button 
            key={day} 
            onClick={() => {
              setSelectedDay(day);
              setCurrentExerciseIndex(0); // Reset exercise index when changing day
            }}
          >
            Day {day}
          </button>
        ))}
      </nav>
    )}
      
    {/* ✅ Display Exercise Sets Correctly */}
{selectedWeek !== null && selectedDay !== null && currentDayExercises.length > 0 && currentExerciseIndex !== null ? (
  <div key={currentDayExercises[currentExerciseIndex]?.exercise_id} style={{ marginTop: "20px", textAlign: "center" }}>
    <h2>🏋️‍♂️ Exercise {currentExerciseIndex + 1}: {currentDayExercises[currentExerciseIndex]?.exercise_id?.replace(/_/g, " ")}</h2>
    <p>
      Sets: {Array.from({ length: currentDayExercises[currentExerciseIndex]?.sets || 0 }, (_, i) => (
        <span key={i}>
          {((exerciseStates[currentDayExercises[currentExerciseIndex]?.exercise_id] || 0) > i) ? "●" : "○"}
        </span>
      ))} ({exerciseStates[currentDayExercises[currentExerciseIndex]?.exercise_id] || 0}/{currentDayExercises[currentExerciseIndex]?.sets})
    </p>
    <p><strong>Duration/Reps:</strong> {currentDayExercises[currentExerciseIndex]?.reps} </p>
    <p><strong>Rest:</strong> {currentDayExercises[currentExerciseIndex]?.rest_time} </p>
    <button onClick={() => handleCompleteSet()}>Set Completed</button>
  </div>
) : (
  <p></p>
)}





      {/* ✅ Display Exercise Details */}
      {exerciseDetails ? (
        <div style={{ padding: "20px", textAlign: "center", maxWidth: "600px", margin: "auto" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>{exerciseDetails.name}</h2>

          {/* ✅ Exercise Images */}
          {exerciseDetails.images && (
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
              {(Array.isArray(exerciseDetails.images) ? exerciseDetails.images : exerciseDetails.images.split(","))
                .map((imgSrc, index) => {
                  const fullImageUrl = `http://localhost${imgSrc.trim().replace(/\\/g, "/")}`;
                  return (
                    <img
                      key={index}
                      src={fullImageUrl}
                      alt={exerciseDetails.name}
                      style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "10px" }}
                    />
                  );
                })}
            </div>
          )}

          {/* ✅ Exercise Details */}
          <div style={{ textAlign: "left", padding: "10px", fontSize: "16px", color: "#333" }}>
            {Object.keys(exerciseDetails)
              .filter((key) => key !== "id" && key !== "instructions" && key !== "images" && key !== "name")
              .map((key, index) => (
                <p key={index} style={{ marginBottom: "5px" }}>
                  <strong>{key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:</strong>
                  {Array.isArray(exerciseDetails[key]) ? exerciseDetails[key].join(", ") : exerciseDetails[key]}
                </p>
              ))}
          </div>
            {/* Handle Instructions Separately */}
  {exerciseDetails.instructions && (
    <div style={{ marginTop: "10px" }}>
      <h3 style={{ fontWeight: "bold", marginBottom: "5px" }}>Instructions:</h3>
      <ol style={{ paddingLeft: "20px" }}>


        {(Array.isArray(exerciseDetails.instructions) ? exerciseDetails.instructions : JSON.parse(exerciseDetails.instructions))
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

      





      ) : (
        <p>✅ Select a week/day to view exercises.</p>
      )}
    </div>
  );
}

export default ProgramDetails;
