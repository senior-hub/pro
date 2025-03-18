import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from './Sidebar'; 
import '@fortawesome/fontawesome-free/css/all.min.css'; // استيراد Font Awesome CSS

const HeroSection = () => (
    <section style={{ ...styles.hero, backgroundImage: 'url("/asas.png")' }}>
        <h1 style={styles.heroTitle}>Welcome to GlowFit</h1>
        <p style={styles.heroSubtitle}>Achieve your fitness goals with us</p>
      
    </section>
);
const ExerciseFilter = () => {
    const [filters, setFilters] = useState({});
    const [selectedFilters, setSelectedFilters] = useState({});
    const [dropdownOpen, setDropdownOpen] = useState({});
    const [query, setQuery] = useState("");
    const [allExercises, setAllExercises] = useState([]); 
    const [filteredExercises, setFilteredExercises] = useState([]); 
    const [isFiltered, setIsFiltered] = useState(false);
    const navigate = useNavigate();

    // Fetch all exercises initially
    useEffect(() => {
        axios.get("http://localhost/my-app/src/backend/applyFilter.php")
            .then(response => {
                console.log("✅ All Exercises from Backend:", response.data);
                setAllExercises(Array.isArray(response.data) ? response.data : []);
                setFilteredExercises(Array.isArray(response.data) ? response.data : []); 
            })
            .catch(error => {
                console.error("❌ Error fetching exercises:", error);
                setFilteredExercises([]); 
            });
    }, []);

    // Fetch filter options from backend
    useEffect(() => {
        axios.get("http://localhost/my-app/src/backend/exercisesfilter.php")
            .then(response => {
                console.log("✅ Filter Options:", response.data);
                setFilters(response.data);

                const initialFilters = {};
                Object.keys(response.data).forEach((key) => (initialFilters[key] = []));
                setSelectedFilters(initialFilters);

                const initialDropdowns = {};
                Object.keys(response.data).forEach((key) => (initialDropdowns[key] = false));
                setDropdownOpen(initialDropdowns);
            })
            .catch(error => console.error("❌ Error fetching filters:", error));
    }, []);

    // Fetch filtered exercises when filters change
    useEffect(() => {
        if (Object.values(selectedFilters).some(arr => arr.length > 0)) {
            setIsFiltered(true);
            console.log("✅ Filtered:", selectedFilters);

            axios.post("http://localhost/my-app/src/backend/applyFilter.php", { filters: selectedFilters })
                .then(response => {
                    console.log("✅ Filtered Exercises:", response.data);
                    setFilteredExercises(Array.isArray(response.data) ? response.data : []); 
                })
                .catch(error => {
                    console.error("❌ Error fetching filtered exercises:", error);
                    setFilteredExercises([]); 
                });
        } else {
            setIsFiltered(false);
            setFilteredExercises(allExercises);
        }
    }, [selectedFilters]);

    // Live search: Updates results instantly
    useEffect(() => {
        if (query.length > 0) {
            const searchWithin = isFiltered ? filteredExercises : allExercises;
            const results = searchWithin.filter(exercise =>
                exercise.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredExercises(results);
        } else {
            setFilteredExercises(isFiltered ? filteredExercises : allExercises);
        }
    }, [query]);

    // Toggle dropdown visibility
    const toggleDropdown = (filterName) => {
        setDropdownOpen(prev => ({
            ...prev,
            [filterName]: !prev[filterName],
        }));
    };

    // Handle checkbox selection
    const handleCheckboxChange = (filterName, value) => {
        setSelectedFilters(prev => {
            const updatedValues = prev[filterName].includes(value)
                ? prev[filterName].filter(item => item !== value)
                : [...prev[filterName], value];

            return { ...prev, [filterName]: updatedValues };
        });
    };

    // Format Image URL
    const formatImageUrl = (imgSrc) => `http://localhost${imgSrc.trim().replace(/\\/g, "/")}`;

    // Convert arrays to readable strings
    const formatMuscles = (muscles) => {
        if (Array.isArray(muscles)) {
            return muscles.join(", ");
        } else if (typeof muscles === "string") {
            return muscles.split(",").map(m => m.trim()).join(", ");
        }
        return "N/A";
    };

    const handleCardClick = (exercise) => {
        navigate("/Home/ExerciseFilter/ExerciseDetails" , { state: { exercise } });
    };

    return (
        <div style={styles.layout}>
            <Sidebar />
            <main style={styles.mainContent}>
                <HeroSection />
                <div style={{ padding: "20px", fontFamily: "Arial" }}>
                    <h2>Exercise Search</h2>

                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search for exercises..."
                        style={{
                            width: "100%", maxWidth: "400px", padding: "10px",
                            fontSize: "16px", borderRadius: "5px", border: "2px solid #ddd",
                            marginBottom: "20px", outline: "none"
                        }}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    {/* Render multi-select dropdowns dynamically */}
                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "20px" }}>
                        {Object.entries(filters).map(([filterName, options]) => (
                            <div key={filterName} style={{ position: "relative" }}>
                                <button
                                    onClick={() => toggleDropdown(filterName)}
                                    style={{
                                        padding: "10px",
                                        borderRadius: "5px",
                                        border: "1px solid #ccc",
                                        cursor: "pointer",
                                        backgroundColor: "green",
                                        color:"white",
                                    }}
                                >
                                    {filterName} ▼
                                </button>
                                {/* Dropdown Menu */}
                                {dropdownOpen[filterName] && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "40px",
                                            left: "0",
                                            backgroundColor: "#fff",
                                            border: "1px solid #ccc",
                                            padding: "10px",
                                            boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
                                            maxHeight: "200px",
                                            overflowY: "auto",
                                            zIndex: 1000
                                        }}
                                    >
                                        {options.map((option) => (
                                            <label key={option} style={{ display: "block", marginBottom: "5px" }}>
                                                <input
                                                    type="checkbox"
                                                    value={option}
                                                    checked={selectedFilters[filterName].includes(option)}
                                                    onChange={() => handleCheckboxChange(filterName, option)}
                                                /> {option}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Display Filtered Exercises */}
                    <h3>Filtered Exercises</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
                        {filteredExercises.length > 0 ? (
                            filteredExercises.map((exercise, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleCardClick(exercise)}
                                    style={{
                                        background: "#fff",
                                        border: "2px solid #ddd",
                                        borderRadius: "10px",
                                        padding: "10px",
                                        width: "300px",
                                        cursor: "pointer"
                                    }}
                                >
                                    {exercise.images && (
                                        <img
                                            src={formatImageUrl(Array.isArray(exercise.images) ? exercise.images[0] : exercise.images.split(",")[0])}
                                            alt={`Exercise ${exercise.name}`}
                                            style={{ width: "100%", height: "200px", objectFit: "cover" }}
                                        />
                                    )}
                                    <h3>{exercise.name}</h3>
                                    <p><strong>Primary Muscles:</strong> {formatMuscles(exercise.primaryMuscles)}</p>
                                    <p><strong>Secondary Muscles:</strong> {formatMuscles(exercise.secondaryMuscles)}</p>
                                </div>
                            ))
                        ) : (
                            <p>No exercises found. Try changing filters or searching.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );

};

const styles = {
    layout: {
        display: 'flex',
    },
    mainContent: {
        flex: 1,
        padding: '20px',
    },
    hero: {
        height: '300px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
        marginBottom: '20px',
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

export default ExerciseFilter;