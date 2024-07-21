import React, { useState } from "react";
import "./SignUp.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaFacebookSquare } from "react-icons/fa";
import { FaGooglePlay } from "react-icons/fa";
import { FaMicrosoft } from "react-icons/fa";

function SignUp() {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState({
    emailOrMobile: "",
    fullName: "",
    username: "",
    password: "",
  });

  const [validationError, setValidationError] = useState({
    emailOrMobile: "",
    fullName: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValidationError((prevError) => ({
      ...prevError,
      [name]: "",
    }));

    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      [name]: value,
    }));
  };

  const handleSignUp = async () => {
    let isValid = true;
    const newValidationError = {
      emailOrMobile: "",
      fullName: "",
      username: "",
      password: "",
    };

    Object.keys(inputValue).forEach((key) => {
      if (inputValue[key].trim() === "") {
        newValidationError[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
        isValid = false;
      }
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{10}$/;

    if (
      "emailOrMobile" in inputValue &&
      !emailRegex.test(inputValue.emailOrMobile.trim()) &&
      !mobileRegex.test(inputValue.emailOrMobile.trim())
    ) {
      newValidationError.emailOrMobile = "Invalid email or mobile number";
      isValid = false;
    }

    if ("fullName" in inputValue && inputValue.fullName.trim().length < 3) {
      newValidationError.fullName = "Full Name should be at least 3 characters";
      isValid = false;
    }

    if ("username" in inputValue && inputValue.username.trim().length < 3) {
      newValidationError.username = "Username should be at least 3 characters";
      isValid = false;
    }

    if ("password" in inputValue && inputValue.password.trim().length < 6) {
      newValidationError.password = "Password should be at least 6 characters";
      isValid = false;
    }

    if (!isValid) {
      setValidationError(newValidationError);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputValue),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Signup successful:", data);

        const userToken = "exampleToken";

        localStorage.setItem("userToken", userToken);

        document.cookie = `userToken=${userToken}; SameSite=None; Secure`;

        setValidationError({
          emailOrMobile: "",
          fullName: "",
          username: "",
          password: "",
        });

        navigate("/login");
      } else {
        const errorData = await response.json();
        console.error("Signup failed:", errorData);
      }
    } catch (error) {
      console.error("Error sending signup request:", error);
    }
  };

  return (
    <div className="login">
      <div className="signup-form">
        <div className="login-form-one">
          <Link to="/" className="login-form-one-link">
            <h5>Instagram</h5>
          </Link>
          <span className="signup-form-one-subheader">
            Sign up to see photos and videos from your friends.
          </span>
          <button className="signup-facebook-button">
            <FaFacebookSquare className="signup-facebook-button-icon" />
            <span>Log in with Facebook</span>
          </button>
          <p>---------- OR ----------</p>
          <input
            type="text"
            placeholder="Mobile number or email address"
            name="emailOrMobile"
            value={inputValue.emailOrMobile}
            onChange={handleChange}
          ></input>
          <span className="validation-error">
            {validationError.emailOrMobile}
          </span>
          <input
            type="text"
            placeholder="Full Name"
            name="fullName"
            value={inputValue.fullName}
            onChange={handleChange}
          ></input>
          <span className="validation-error">{validationError.fullName}</span>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={inputValue.username}
            onChange={handleChange}
          ></input>
          <span className="validation-error">{validationError.username}</span>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={inputValue.password}
            onChange={handleChange}
          ></input>
          <span className="validation-error">{validationError.password}</span>
          <div className="signup-form-one-learnmore">
            <span>
              People who use our service may have uploaded your contact
              information to Instagram.
            </span>
            <span className="signup-form-one-learnmore-navy">Learn more</span>
          </div>
          <div className="signup-form-one-learnmore">
            <span>By signing up, you agree to our </span>
            <span className="signup-form-one-learnmore-navy">
              Terms, Privacy Policy and Cookies Policy.
            </span>
          </div>
          <button className="signup-form-one-signup-btn" onClick={handleSignUp}>
            Sign Up
          </button>
        </div>
        <div className="signup-form-two">
          <div className="login-form-two-sub">
            <span>Have an account?</span>
            <Link to="/login" className="link">
              <span className="login-form-two-sub-signup">Log in</span>
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

export default SignUp;
