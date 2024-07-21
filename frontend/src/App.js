import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Login from "./components/pages/Login";
import SignUp from "./components/pages/SignUp";
import Profile from "./components/pages/Profile";
import AuthRoute from "./components/routing/AuthRoute";
import Home from "./components/Home";
import NotFound from "./components/common/NotFound";

import { useDarkMode } from "./context/DarkModeContext";
import Explore from "./components/pages/Explore";

function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const NavbarContainer = (
    <>
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
    </>
  );

  return (
    <Router>
      <div className={`App ${isDarkMode ? "dark-mode" : ""}`}>
        <Routes>
          <Route element={<AuthRoute />}>
            <Route
              path="/"
              index
              element={
                <>
                  {NavbarContainer}
                  <Home />
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  {NavbarContainer}
                  <Profile />
                </>
              }
            />
            <Route
              path="/explore"
              element={
                <>
                  {NavbarContainer}
                  <Explore />
                </>
              }
            />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="*"
            element={
              <>
                {NavbarContainer}
                <NotFound />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
