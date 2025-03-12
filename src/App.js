import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Welcome from "./components/Welcome";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import Login from "./components/Login";   
import AdminHome from "./components/AdminHome";
import Profile from "./components/profile";
import SetGoal from "./components/SetGoal";
import Dashboard from "./components/Dashboard";
import ExerciseDetails from "./components/ExerciseDetails";
import FitnessPrograms from "./components/FitnessPrograms";
import ProgramDetails from "./components/ProgramDetails";
import ShowFavorite from "./components/ShowFavorite";
import ExerciseFilter from "./components/ExerciseFilter";

function App() {
  return (
    <Router>
      <div className="App">
      <AppProvider>
        <Routes>
        <Route path="/Home/ExerciseFilter" element={<ExerciseFilter />} />

        <Route path="/Home/ShowFavorite" element={<ShowFavorite />} />
          <Route path="/SetGoal" element={<SetGoal />} />
          <Route path="/" element={<Welcome />} />
          <Route path="/AdminHome" element={<AdminHome />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Home/ExerciseFilter/ExerciseDetails" element={<ExerciseDetails />} />
          <Route path="/Home/FitnessPrograms" element={<FitnessPrograms />} />
          <Route path="/Home/FitnessPrograms/ProgramDetails" element={<ProgramDetails />} />

          
    

        </Routes>
        </AppProvider>

      </div>
    </Router>
  );
}

export default App;
 