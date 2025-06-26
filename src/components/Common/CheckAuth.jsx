// src/components/Common/CheckAuth.js
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const CheckAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
    // return <div>Loading authentication status...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default CheckAuth;
