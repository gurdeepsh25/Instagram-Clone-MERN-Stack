import React from "react";
import "./Loader.css";
import logo from "../../assets/logo.png";

function Loader() {
  return (
    <div className="loader">
      <img src={logo} alt="App Logo" />
    </div>
  );
}

export default Loader;
