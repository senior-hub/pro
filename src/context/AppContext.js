<<<<<<< HEAD
// 📁 src/context/AppContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

// Create Context
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate(); // Centralized navigation

  // ✅ Define all global states in context
  const [userId, setUserId] = useState(() => sessionStorage.getItem("userId") || null);
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem("loggedIn") === "true");
  const [theme, setTheme] = useState(() => sessionStorage.getItem("theme") || "light");

  
  // ✅ Sync sessionStorage when loggedIn or userId changes
  useEffect(() => {
    
    sessionStorage.setItem("loggedIn", loggedIn);
    if (userId) {
      sessionStorage.setItem("userId", userId);
    } else {
      sessionStorage.removeItem("userId");
    }
  }, [loggedIn, userId]);

  const location = useLocation();
  useEffect(() => {
    if (!loggedIn && location.pathname.toLowerCase() !== "/signup") {
      navigate("/login");
    }
  }, [loggedIn, navigate, location.pathname]);
  

  // ✅ Sync sessionStorage when loggedIn or userId changes
  useEffect(() => {
    sessionStorage.setItem("loggedIn", loggedIn);
    if (userId) {
      sessionStorage.setItem("userId", userId);
    } else {
      sessionStorage.removeItem("userId");
    }
  }, [loggedIn, userId]);



  // ✅ Toggle Theme (Save to sessionStorage)
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    sessionStorage.setItem("theme", newTheme);
  };

  // ✅ Logout Function
  const logout = () => {
    setUserId(null);
    setLoggedIn(false);
    sessionStorage.clear(); // Clears all sessionStorage keys
    navigate("/login");
  };

  return (
    <AppContext.Provider value={{ navigate, userId, loggedIn, setUserId, setLoggedIn, logout, theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook for Using Context
export const useApp = () => useContext(AppContext);
=======
// 📁 src/context/AppContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

// Create Context
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate(); // Centralized navigation

  // ✅ Define all global states in context
  const [userId, setUserId] = useState(() => sessionStorage.getItem("userId") || null);
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem("loggedIn") === "true");
  const [theme, setTheme] = useState(() => sessionStorage.getItem("theme") || "light");

  
  // ✅ Sync sessionStorage when loggedIn or userId changes
  useEffect(() => {
    
    sessionStorage.setItem("loggedIn", loggedIn);
    if (userId) {
      sessionStorage.setItem("userId", userId);
    } else {
      sessionStorage.removeItem("userId");
    }
  }, [loggedIn, userId]);

  const location = useLocation();
  useEffect(() => {
    if (!loggedIn && 
        location.pathname.toLowerCase() !== "/signup" && 
        location.pathname.toLowerCase() !== "/") {
      navigate("/login");
    }
  }, [loggedIn, navigate, location.pathname]);
  

  // ✅ Sync sessionStorage when loggedIn or userId changes
  useEffect(() => {
    sessionStorage.setItem("loggedIn", loggedIn);
    if (userId) {
      sessionStorage.setItem("userId", userId);
    } else {
      sessionStorage.removeItem("userId");
    }
  }, [loggedIn, userId]);



  // ✅ Toggle Theme (Save to sessionStorage)
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    sessionStorage.setItem("theme", newTheme);
  };

  // ✅ Logout Function
  const logout = () => {
    setUserId(null);
    setLoggedIn(false);
    sessionStorage.clear(); // Clears all sessionStorage keys
    navigate("/login");
  };

  return (
    <AppContext.Provider value={{ navigate, userId, loggedIn, setUserId, setLoggedIn, logout, theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook for Using Context
export const useApp = () => useContext(AppContext);
>>>>>>> copy-enhanced-ui-chatbot-changes
