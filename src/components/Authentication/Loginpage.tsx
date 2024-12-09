import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./../Firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useGlobalContext } from "../context/GlobalContext"; // Import Global Context
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Firestore imports
import "./AuthPage.css";

const db = getFirestore(); // Initialize Firestore

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(true); // Toggle between Sign-Up and Login
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [skipLogin, setSkipLogin] = useState<boolean>(false); // Toggle skip state
  const navigate = useNavigate(); // Navigation hook
  const { setUserId } = useGlobalContext(); // Get the setUserId function from GlobalContext

  // Function to save user email in Firestore
  const saveUserToFirestore = async (uid: string, email: string) => {
    try {
      const userRef = doc(db, "users", uid);
      await setDoc(userRef, {
        email,
        createdAt: new Date(),
      });
      console.log("User data saved to Firestore:", { uid, email });
    } catch (error) {
      console.error("Error saving user data to Firestore:", error);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      if (isSignUp) {
        // Sign up new user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user email to Firestore
        await saveUserToFirestore(user.uid, user.email || "");
        setMessage("Sign-up successful! You can now log in.");
        setIsSignUp(false);
        setUserId(user.uid); // Set userId in global context
        console.log("Signed up user ID:", user.uid);
      } else {
        // Login existing user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        setMessage("Login successful!");
        setUserId(user.uid); // Set userId in global context
        console.log("Logged in user ID:", user.uid);
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
