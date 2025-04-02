import React from "react";
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
=======
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
>>>>>>> copy-enhanced-ui-chatbot-changes
import { AppProvider } from "./context/AppContext";
import Welcome from "./components/Welcome";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
<<<<<<< HEAD
import Login from "./components/Login";   
=======
import Login from "./components/Login";
>>>>>>> copy-enhanced-ui-chatbot-changes
import AdminHome from "./components/AdminHome";
import Profile from "./components/profile";
import SetGoal from "./components/SetGoal";
import Dashboard from "./components/Dashboard";
import ExerciseDetails from "./components/ExerciseDetails";
import FitnessPrograms from "./components/FitnessPrograms";
import ProgramDetails from "./components/ProgramDetails";
import ShowFavorite from "./components/ShowFavorite";
import ExerciseFilter from "./components/ExerciseFilter";
<<<<<<< HEAD
import ChatBot from "./components/ChatBot"; // Import ChatBot
=======
import ChatBot from "./components/ChatBot";
>>>>>>> copy-enhanced-ui-chatbot-changes

function App() {
  return (
    <Router>
      <div className="App">
<<<<<<< HEAD
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
          <Route path="/Dashboard" element={<>
            <Dashboard />
            <ChatBot /> {/* Chatbot added to Dashboard */}
          </>} />
          <Route path="/Home/ExerciseFilter/ExerciseDetails" element={<ExerciseDetails />} />
          <Route path="/Home/FitnessPrograms" element={<FitnessPrograms />} />
          <Route path="/Home/FitnessPrograms/ProgramDetails" element={<ProgramDetails />} />

          <Route path="/Home/ChatBot" element={<ChatBot />} />
    

        </Routes>
        </AppProvider>

=======
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
>>>>>>> copy-enhanced-ui-chatbot-changes
      </div>
    </Router>
  );
}

<<<<<<< HEAD
export default App;
 
=======
export default App;
>>>>>>> copy-enhanced-ui-chatbot-changes
