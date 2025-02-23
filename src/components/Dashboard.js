import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const userId = sessionStorage.getItem("userId");

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
