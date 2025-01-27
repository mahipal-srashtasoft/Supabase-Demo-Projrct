import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token"); // Check for token in localStorage

  if (!token) {
    // If no token, redirect to Show Products page
    return <Navigate to="/show-products" replace />;
  }

  // If token exists, render the children components
  return children;
}

export default PrivateRoute;
