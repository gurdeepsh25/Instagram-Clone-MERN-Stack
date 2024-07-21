import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebookSquare } from "react-icons/fa";
import { FaGooglePlay } from "react-icons/fa";
import { FaMicrosoft } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
  });

  const [validationError, setValidationError] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevLoginData) => ({
      ...prevLoginData,
      [name]: value,
    }));

    setValidationError((prevError) => ({
      ...prevError,
      [name]: "",
    }));
  };

  const handleLogin = async () => {
    let isValid = true;
    const newValidationError = {
      identifier: "",
      password: "",
    };

    Object.keys(loginData).forEach((key) => {
      if (loginData[key].trim() === "") {
        newValidationError[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
        isValid = false;
      }
    });

    if ("identifier" in loginData && loginData.identifier.trim() === "") {
      newValidationError.identifier = "Please enter one of the following";
      isValid = false;
    }

    if ("password" in loginData && loginData.password.trim().length === 0) {
      newValidationError.password = "Password is required";
      isValid = false;
    }

    if (!isValid) {
      setValidationError(newValidationError);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("Login successful:", userData);

        const userToken = "exampleToken";

        localStorage.setItem("userToken", userToken);

        document.cookie = `userToken=${userToken}; SameSite=None; Secure`;

        localStorage.setItem("userToken", userData.token);
        localStorage.setItem("username", userData.username);
        localStorage.setItem("fullName", userData.fullName);

        navigate("/", { replace: true });
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
      }
    } catch (error) {
      console.error("Error sending login request:", error);
    }
  };

  return (
    <div className="login">
      <div className="login-form">
        <div className="login-form-one">
          <Link to="/" className="login-form-one-link">
            <h5>Instagram</h5>
          </Link>
          <input
            type="text"
            placeholder="Phone number, username, or email address"
            name="identifier"
            value={loginData.identifier}
            onChange={handleChange}
          ></input>
          <span className="validation-error">{validationError.identifier}</span>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
          ></input>
          <span className="validation-error">{validationError.password}</span>
          <button onClick={handleLogin}>Log in</button>
          <p>---------- OR ----------</p>
          <div className="login-facebook">
            <FaFacebookSquare className="login-facebook-icon" />
            <span>Log in with Facebook</span>
          </div>
          <span className="login-forgotpassword">Forgotten your password?</span>
        </div>
        <div className="login-form-two">
          <div className="login-form-two-sub">
            <span>Don't have an account?</span>
            <Link to="/signup" className="link">
              <span className="login-form-two-sub-signup">Sign up</span>
            </Link>
          </div>
        </div>
        <div className="login-form-three">
          <span>Get the app.</span>
          <div className="login-form-three-sub">
            <div className="login-googlemicrosoft">
              <FaGooglePlay className="login-googlemicrosoft-icon" />
              <div className="login-googlemicrosoft-sub">
                <span>GET IT ON</span>
                <p>Google Play</p>
              </div>
            </div>
            <div className="login-googlemicrosoft">
              <FaMicrosoft className="login-googlemicrosoft-icon" />
              <div className="login-googlemicrosoft-sub">
                <span>Get it from</span>
                <p>Microsoft</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
