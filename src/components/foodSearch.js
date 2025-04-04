import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../style/ExerciseFilter.css";
import "../style/Pagination.css"; // Import separate pagination CSS

const ExerciseSearch = () => {
    const [query, setQuery] = useState("");
    const [allExercises, setAllExercises] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [exercisesPerPage, setExercisesPerPage] = useState(12);
    const [paginatedExercises, setPaginatedExercises] = useState([]);

    const navigate = useNavigate();

        // Fetch data when query changes
        useEffect(() => {
            if (query.length > 0) {
              const delayDebounce = setTimeout(() => {
                console.log("🔍 Searching for:", query);
                fetchData(query); // Server-side search
              }, 300);
          
              return () => clearTimeout(delayDebounce);
            } else {
              console.log("📦 Query empty — fetching all food data...");
              axios
                .get("http://localhost/my-app/src/backend/fetchFood.php")
                .then((res) => {
                  const rawData = res.data;
                  const parsedData = Array.isArray(rawData) ? rawData : Object.values(rawData); // ✅ FIXED HERE
                  console.log("Raw food data:", rawData);
                  console.log("✅ Final food data:", parsedData);
                  setAllExercises(parsedData);
                  setLoading(false);
          
               
                })
                .catch((err) => {
                  console.error("❌ Failed to fetch:", err);
                  setAllExercises([]);
                  setLoading(false);
                });
            }
          }, [query]);
          



      
        const fetchData = (searchTerm) => {
            fetch(`http://localhost/my-app/src/backend/fetchFood.php?query=${encodeURIComponent(searchTerm)}`)
              .then((res) => {
                if (!res.ok) {
                  throw new Error("Server responded with error");
                }
                return res.json();
              })
              .then((data) => {
                console.log("🔎 Search results:", data);
          
                // Ensure it's in array format
                const parsed = Array.isArray(data) ? data : Object.values(data);
                setAllExercises(parsed);
                setCurrentPage(1);
              })
              .catch((err) => {
                console.error("❌ Search failed:", err);
                setAllExercises([]);
              });
          };
          
      
    // Calculate pagination
    useEffect(() => {
        const indexOfLastExercise = currentPage * exercisesPerPage;
        const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;

        setPaginatedExercises(
            allExercises.slice(indexOfFirstExercise, indexOfLastExercise)
        );

        // Scroll to top when page changes
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, [currentPage, exercisesPerPage, allExercises]);

    
   

    const handleCardClick = (food) => {
        navigate("/Home/ExerciseFilter/ExerciseDetails", { state: { food } });
    };

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Go to next page
    const nextPage = () => {
        if (currentPage < Math.ceil(allExercises.length / exercisesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Go to previous page
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    // Create a shortened list of page numbers with ellipsis
    const getPageNumbers = () => {
        const totalPages = Math.ceil(allExercises.length / exercisesPerPage);
        
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


    // Generate page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(allExercises.length / exercisesPerPage); i++) {
        pageNumbers.push(i);
    }

    const indexOfLast = currentPage * exercisesPerPage;
    const indexOfFirst = indexOfLast - exercisesPerPage;
    const currentExercises = allExercises.slice(indexOfFirst, indexOfLast);

    return (
        <div className="page-container">
          <Sidebar />
      
          <div className="filter-container with-sidebar">
            <h2 className="filter-title">Food Search</h2>
      
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search for foods..."
              className="search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
      
            {/* Header */}
            <div className="results-header">
              <h3 className="section-title">
                {allExercises.length > 0
                  ? `Exercises (${allExercises.length})`
                  : "No Exercises Found"}
              </h3>
            </div>
            {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading exercises...</p>
                    </div>
                ) : allExercises.length > 0 ? (
                    <>
            <div className="exercises-grid">
            {currentExercises.map((item, index) => {
                const groups = {
                  General: [],
                  Macronutrients: [],
                  Fats: [],
                  Vitamins: [],
                  Minerals: [],
                  Others: [],
                };
      
                Object.entries(item).forEach(([key, value]) => {
                  if (
                    key === "Description" ||
                    key === "Category" ||
                    key === "Nutrient Data Bank Number"
                  ) {
                    groups.General.push([key, value]);
                  } else if (key.includes("Fat")) {
                    groups.Fats.push([key, value]);
                  } else if (key.includes("Vitamin")) {
                    groups.Vitamins.push([key, value]);
                  } else if (key.includes("Major Minerals")) {
                    groups.Minerals.push([key, value]);
                  } else if (
                    key.includes("Carbohydrate") ||
                    key.includes("Sugar") ||
                    key.includes("Protein") ||
                    key.includes("Water") ||
                    key.includes("Fiber")
                  ) {
                    groups.Macronutrients.push([key, value]);
                  } else {
                    groups.Others.push([key, value]);
                  }
                });
      
                return (
                  <div
                    key={index}
                    className="exercise-card"
                    onClick={() => handleCardClick(item)}
                  >
                    <h2 className="text-lg font-semibold text-blue-600">
                      {item.Description}
                    </h2>
                    <p className="text-sm text-gray-500 mb-2">
                      Category: {item.Category}
                    </p>
                    <p className="text-xs text-gray-400 mb-2">
                      ID: {item["Nutrient Data Bank Number"]}
                    </p>
      
                    {Object.entries(groups).map(([groupName, fields]) =>
                      fields.length > 0 ? (
                        <div key={groupName} className="mt-4">
                          <h4 className="text-sm font-bold text-gray-700 mb-2 border-b">
                            {groupName}
                          </h4>
                          <div className="text-sm space-y-1">
                            {fields.map(([label, val]) =>
                              typeof val !== "object" ? (
                                <p key={label}>
                                  <span className="font-medium">
                                    {label.replace(/^Data\./, '').replace(/\./g, ' ')}:
                                  </span>{' '}{val}
                                </p>
                              ) : null
                            )}
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                );
            })}
            </div>
       {/* Pagination Controls */}
       {allExercises.length > exercisesPerPage && (
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
                                    className={`pagination-button ${currentPage === Math.ceil(allExercises.length / exercisesPerPage) ? 'disabled' : ''}`}
                                    disabled={currentPage === Math.ceil(allExercises.length / exercisesPerPage)}
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        )}
                        
                        {/* Page indicator for mobile */}
                        {allExercises.length > exercisesPerPage && (
                            <div className="page-indicator">
                                Page {currentPage} of {Math.ceil(allExercises.length / exercisesPerPage)}
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

export default ExerciseSearch;