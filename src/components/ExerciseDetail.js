import { useLocation } from "react-router-dom";

const ExerciseDetail = () => {
  const location = useLocation();
  const exercise = location.state?.exercise; // Get exercise data

  if (!exercise) {
    return <p style={{ padding: "20px", textAlign: "center", fontSize: "18px" }}>No exercise details found.</p>;
  }

  return (
    <div style={{ padding: "20px", textAlign: "center", maxWidth: "600px", margin: "auto" }}>
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
    </div>
  );
};

export default ExerciseDetail;
