import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";
import { Box, Typography, CircularProgress } from "@mui/material";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { userId } = useGlobalContext(); // Access userId from the global context
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!userId) {
      setShowMessage(true); // Show the message when not authenticated
      const timer = setTimeout(() => {
        setShowMessage(false); // Hide message after 2 seconds and trigger navigation
      }, 2000);
      return () => clearTimeout(timer); // Cleanup timeout on unmount
    }
  }, [userId]);

  // If the userId is not set, show the message and redirect after a brief delay
  if (!userId && !showMessage) {
    return <Navigate to="/login" replace />;
  }

  if (!userId && showMessage) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
      >
        <CircularProgress sx={{ mb: 2 }} color="error" />
        <Typography variant="h6" color="error" textAlign="center">
          You are not an authenticated user. Redirecting to login...
        </Typography>
      </Box>
    );
  }

  // If the userId exists, render the child components
  return <>{children}</>;
};

export default ProtectedRoute;
