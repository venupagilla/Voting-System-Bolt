import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import RegistrationForm from "./components/RegistrationForm";
import VotingPage from "./components/VotingPage";

function App() {
  const isRegistered = localStorage.getItem("voterData") !== null;
  const hasVoted = localStorage.getItem("hasVoted") === "true";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/register"
          element={isRegistered ? <Navigate to="/vote" replace /> : <RegistrationForm />}
        />
        <Route
          path="/vote"
          element={isRegistered && !hasVoted ? <VotingPage /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
