/* eslint-disable */
import React from "react";
import "./App.css"; // Import the CSS file
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Upload from "./Upload";
import Slideshow from "./Slideshow";

const App = () => {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Upload />} />
      <Route path="/slideshow" element={<Slideshow />} />
    </Routes>
  </Router>
  );
};

export default App;
