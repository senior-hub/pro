import { useApp } from "../context/AppContext";
import React, { useEffect } from 'react';

function Dashboard() {

  const { navigate, userId, theme, toggleTheme } = useApp();

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("loggedIn");

    if (!loggedIn) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <h1>Welcome, {userId}!</h1>
      <p>Dashboard content goes here...</p>
    </div>
  );
}

export default Dashboard;
