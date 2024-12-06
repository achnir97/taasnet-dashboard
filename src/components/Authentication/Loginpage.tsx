import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // React Router for navigation
import { auth } from "./../Firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "./AuthPage.css";

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(true); // Toggle between Sign-Up and Login
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [skipLogin, setSkipLogin] = useState<boolean>(false); // Toggle skip state
  const navigate = useNavigate(); // Navigation hook

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage("Sign-up successful! You can now log in.");
        setIsSignUp(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("Login successful!");
        navigate("/home"); // Navigate to homepage on successful login
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  // Handle the toggle state for skipping login
  const handleToggle = () => {
    setSkipLogin(!skipLogin);
    if (!skipLogin) navigate("/home"); // Navigate to homepage if toggled ON
  };

  return (
    <div className="auth-container">
      {!skipLogin ? (
        <form className="auth-form" onSubmit={handleAuth}>
          <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
          {message && <div className="auth-message">{message}</div>}

          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </label>

          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>

          <button type="submit" className="auth-button">
            {isSignUp ? "Sign Up" : "Login"}
          </button>

          <div className="auth-toggle">
            <p>
              {isSignUp
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                type="button"
                className="toggle-button"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Login" : "Sign Up"}
              </button>
            </p>
          </div>
        </form>
      ) : (
        <h2>Redirecting to Homepage...</h2>
      )}

      {/* Skip Login Toggle Button */}
      <div className="skip-login-container">
        <span>Skip Login</span>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={skipLogin}
            onChange={handleToggle}
            aria-label="Toggle to skip login"
          />
          <span className="slider" />
        </label>
      </div>
    </div>
  );
};

export default AuthPage;
