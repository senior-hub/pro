import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Welcome from "./components/Welcome";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import Login from "./components/Login";   
import AdminHome from "./components/AdminHome";
import Profile from "./components/profile";
import SetGoal from "./components/SetGoal";
import Dashboard from "./components/Dashboard";
import ExerciseSearch from "./components/ExerciseSearch";
import ExerciseDetail from "./components/ExerciseDetail";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/Home/ExerciseSearch" element={<ExerciseSearch />} />
          <Route path="/SetGoal" element={<SetGoal />} />
          <Route path="/" element={<Welcome />} />
          <Route path="/AdminHome" element={<AdminHome />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Home/ExerciseSearch/ExerciseDetail" element={<ExerciseDetail />} />

    

        </Routes>
      </div>
    </Router>
  );
}

export default App;
 