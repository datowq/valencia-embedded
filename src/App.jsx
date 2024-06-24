import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Emote from "./Emote";
import ResumeGameManager from "./resumegame/ResumeGameManager";
import Credits from "./creditspage/Credits";
import Contact from "./contactpage/Contact";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/resume" element={<ResumeGameManager />} />
        <Route path="/about" element={<ResumeGameManager />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/projects" element={<ResumeGameManager />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/" exact element={<Emote />} />
        <Route path="*" element={<Emote />} />
      </Routes>
    </Router>
  );
};

export default App;
