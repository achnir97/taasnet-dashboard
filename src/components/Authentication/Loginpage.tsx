import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  useTheme,
} from "@mui/material";

const BACKEND_URL = "http://222.112.183.197:8086";

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [skipLogin, setSkipLogin] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setUserId } = useGlobalContext();
  const theme = useTheme();

  const handleSignUp = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Sign-up failed. Please try again.");
      }

      const data = await response.json();
      setMessage("Sign-up successful! You can now log in.");
      setIsSignUp(false);
      console.log("Signed-up user:", data);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      console.error("Sign-up error:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials. Please try again.");
      }

      const data = await response.json();
      setMessage("Login successful!");
      setUserId(data.userId || "test-user-id");
      console.log("Logged-in user:", data);
      navigate("/home");
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      console.error("Login error:", error);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (isSignUp) {
      await handleSignUp();
    } else {
      await handleLogin();
    }
  };

  const handleToggle = () => {
    setSkipLogin(!skipLogin);
    if (!skipLogin) navigate("/home");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      {!skipLogin ? (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            maxWidth: 400,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
          component="form"
          onSubmit={handleAuth}
        >
          <Typography variant="h5" align="center" gutterBottom>
            {isSignUp ? "Sign Up" : "Login"}
          </Typography>

          {message && (
            <Typography variant="body2" color="error" align="center">
              {message}
            </Typography>
          )}

          <TextField
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            variant="outlined"
            required
            fullWidth
          />

          <TextField
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            variant="outlined"
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: theme.palette.grey[400],
              color: theme.palette.getContrastText(theme.palette.grey[400]),
              "&:hover": {
                backgroundColor: theme.palette.grey[500],
              },
            }}
          >
            {isSignUp ? "Sign Up" : "Login"}
          </Button>

          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Typography variant="body2">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              &nbsp;
              <Button
                variant="text"
                onClick={() => setIsSignUp(!isSignUp)}
                sx={{ textTransform: "none", color: "text.primary" }}
              >
                {isSignUp ? "Login" : "Sign Up"}
              </Button>
            </Typography>
          </Box>
        </Paper>
      ) : (
        <Typography variant="h6" align="center">
          Redirecting to Homepage...
        </Typography>
      )}

      <Box sx={{ mt: 3, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body2">Skip Login</Typography>
        <FormControlLabel
          control={
            <Switch
              checked={skipLogin}
              onChange={handleToggle}
              aria-label="Toggle to skip login"
            />
          }
          label=""
        />
      </Box>
    </Box>
  );
};

export default AuthPage;
