import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../style/ExerciseFilter.css";
import "../style/Pagination.css"; // Import separate pagination CSS

const ExerciseFilter = () => {
    const [filters, setFilters] = useState({});
    const [selectedFilters, setSelectedFilters] = useState({});
    const [dropdownOpen, setDropdownOpen] = useState({});
    const [query, setQuery] = useState("");
    const [allExercises, setAllExercises] = useState([]); 
    const [filteredExercises, setFilteredExercises] = useState([]); 
    const [isFiltered, setIsFiltered] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [exercisesPerPage, setExercisesPerPage] = useState(12);
    const [paginatedExercises, setPaginatedExercises] = useState([]);
    
    const navigate = useNavigate();

    // Fetch all exercises initially
    useEffect(() => {
        setLoading(true);
        axios.get("http://localhost/my-app/src/backend/applyFilter.php")
            .then(response => {
                console.log("✅ All Exercises from Backend:", response.data);
                setAllExercises(Array.isArray(response.data) ? response.data : []);
                setFilteredExercises(Array.isArray(response.data) ? response.data : []); 
                setLoading(false);
            })
            .catch(error => {
                console.error("❌ Error fetching exercises:", error);
                setFilteredExercises([]); 
                setLoading(false);
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
            setLoading(true);
            console.log("✅ Filtered:", selectedFilters);

            axios.post("http://localhost/my-app/src/backend/applyFilter.php", { filters: selectedFilters })
                .then(response => {
                    console.log("✅ Filtered Exercises:", response.data);
                    setFilteredExercises(Array.isArray(response.data) ? response.data : []); 
                    setCurrentPage(1); // Reset to first page when filters change
                    setLoading(false);
                })
                .catch(error => {
                    console.error("❌ Error fetching filtered exercises:", error);
                    setFilteredExercises([]); 
                    setLoading(false);
                });
        } else {
            setIsFiltered(false);
            setFilteredExercises(allExercises);
            setCurrentPage(1); // Reset to first page when filters are cleared
        }
    }, [selectedFilters, allExercises]);

    // Live search: Updates results instantly
    useEffect(() => {
        if (query.length > 0) {
            const searchWithin = isFiltered ? filteredExercises : allExercises;
            const results = searchWithin.filter(exercise =>
                exercise.name.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredExercises(results);
            setCurrentPage(1); // Reset to first page on new search
        } else if (query.length === 0 && !isFiltered) {
            setFilteredExercises(allExercises);
        }
    }, [query, isFiltered, allExercises]);

    // Calculate pagination
    useEffect(() => {
        // Get current exercises
        const indexOfLastExercise = currentPage * exercisesPerPage;
        const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
        
        setPaginatedExercises(
            filteredExercises.slice(indexOfFirstExercise, indexOfLastExercise)
        );
        
        // Scroll to top when page changes
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, [currentPage, exercisesPerPage, filteredExercises]);

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
        navigate("/Home/ExerciseFilter/ExerciseDetails", { state: { exercise } });
    };

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Go to next page
    const nextPage = () => {
        if (currentPage < Math.ceil(filteredExercises.length / exercisesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Go to previous page
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Generate page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredExercises.length / exercisesPerPage); i++) {
        pageNumbers.push(i);
    }

    // Create a shortened list of page numbers with ellipsis
    const getPageNumbers = () => {
        const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);
        
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        
        if (currentPage <= 3) {
            return [1, 2, 3, 4, '...', totalPages];
        }
        
        if (currentPage >= totalPages - 2) {
            return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }
        
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };

    return (
        <div className="page-container">
            <Sidebar />
            
            <div className="filter-container with-sidebar">
                <h2 className="filter-title">Exercise Search</h2>

                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search for exercises..."
                    className="search-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                {/* Filter Controls */}
                <div className="filter-controls">
                    {Object.entries(filters).map(([filterName, options]) => (
                        <div key={filterName} className="filter-dropdown">
                            <button
                                onClick={() => toggleDropdown(filterName)}
                                className={`filter-button ${dropdownOpen[filterName] ? 'filter-button-active' : ''}`}
                            >
                                {filterName}
                                <span className={`dropdown-icon ${dropdownOpen[filterName] ? 'dropdown-icon-open' : ''}`}>
                                    ▼
                                </span>
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen[filterName] && (
                                <div className="dropdown-menu">
                                    {options.map((option) => (
                                        <label key={option} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                className="checkbox-input"
                                                checked={selectedFilters[filterName].includes(option)}
                                                onChange={() => handleCheckboxChange(filterName, option)}
                                            /> 
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Display Filtered Exercises */}
                <div className="results-header">
                    <h3 className="section-title">
                        {isFiltered ? 'Filtered Exercises' : 'All Exercises'}
                        {filteredExercises.length > 0 && ` (${filteredExercises.length})`}
                    </h3>
                    
                    {filteredExercises.length > exercisesPerPage && (
                        <div className="per-page-selector">
                            <label htmlFor="per-page">Per page:</label>
                            <select 
                                id="per-page"
                                value={exercisesPerPage}
                                onChange={(e) => {
                                    setExercisesPerPage(Number(e.target.value));
                                    setCurrentPage(1); // Reset to first page when changing items per page
                                }}
                            >
                                <option value={6}>6</option>
                                <option value={12}>12</option>
                                <option value={24}>24</option>
                                <option value={48}>48</option>
                            </select>
                        </div>
                    )}
                </div>
                
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading exercises...</p>
                    </div>
                ) : filteredExercises.length > 0 ? (
                    <>
                        <div className="exercises-grid">
                            {paginatedExercises.map((exercise, index) => (
                                <div
                                    key={index}
                                    className="exercise-card"
                                    onClick={() => handleCardClick(exercise)}
                                >
                                    {exercise.images && (
                                        <img
                                            src={formatImageUrl(Array.isArray(exercise.images) ? exercise.images[0] : exercise.images.split(",")[0])}
                                            alt={`Exercise ${exercise.name}`}
                                            className="card-image"
                                        />
                                    )}
                                    <div className="card-content">
                                        <h3 className="card-title">{exercise.name}</h3>
                                        <p className="card-info">
                                            <strong>Primary Muscles:</strong> {formatMuscles(exercise.primaryMuscles)}
                                        </p>
                                        <p className="card-info">
                                            <strong>Secondary Muscles:</strong> {formatMuscles(exercise.secondaryMuscles)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Pagination Controls */}
                        {filteredExercises.length > exercisesPerPage && (
                            <div className="pagination">
                                <button 
                                    onClick={prevPage} 
                                    className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                                    disabled={currentPage === 1}
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                                
                                {getPageNumbers().map((number, index) => (
                                    number === '...' ? (
                                        <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                                    ) : (
                                        <button
                                            key={number}
                                            onClick={() => paginate(number)}
                                            className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                                        >
                                            {number}
                                        </button>
                                    )
                                ))}
                                
                                <button 
                                    onClick={nextPage}
                                    className={`pagination-button ${currentPage === Math.ceil(filteredExercises.length / exercisesPerPage) ? 'disabled' : ''}`}
                                    disabled={currentPage === Math.ceil(filteredExercises.length / exercisesPerPage)}
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        )}
                        
                        {/* Page indicator for mobile */}
                        {filteredExercises.length > exercisesPerPage && (
                            <div className="page-indicator">
                                Page {currentPage} of {Math.ceil(filteredExercises.length / exercisesPerPage)}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="empty-state">
                        <i className="fas fa-search"></i>
                        <p>No exercises found. Try changing filters or search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExerciseFilter;