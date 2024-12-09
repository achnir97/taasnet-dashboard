import React from "react";
import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const auth = getAuth(); // Firebase Authentication
  const user = auth.currentUser;

  // If the user is not logged in, redirect to the login page
  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  // If the user is logged in, render the child components
  return <>{children}</>;
};

export default ProtectedRoute;
