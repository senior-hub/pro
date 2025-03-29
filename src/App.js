import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import ChatBot from "./components/ChatBot";

function App() {
  return (
    <Router>
      <div className="App">
        <AppProvider>
          <Routes>
            {/* Welcome page as the main entry point */}
            <Route path="/" element={<Welcome />} />
            
            {/* Authentication routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Main application routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/adminhome" element={<AdminHome />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/setgoal" element={<SetGoal />} />
            
            {/* Dashboard with ChatBot */}
            <Route path="/dashboard" element={
              <>
                <Dashboard />
                <ChatBot />
              </>
            } />
            
            {/* Exercise related routes */}
            <Route path="/home/exercisefilter" element={<ExerciseFilter />} />
            <Route path="/home/exercisefilter/exercisedetails" element={<ExerciseDetails />} />
            <Route path="/home/showfavorite" element={<ShowFavorite />} />
            
            {/* Fitness programs routes */}
            <Route path="/home/fitnessprograms" element={<FitnessPrograms />} />
            <Route path="/home/fitnessprograms/programdetails" element={<ProgramDetails />} />
            
            {/* ChatBot standalone route */}
            <Route path="/home/chatbot" element={<ChatBot />} />
            
            {/* Handle any incorrect paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppProvider>
      </div>
    </Router>
  );
}

export default App;