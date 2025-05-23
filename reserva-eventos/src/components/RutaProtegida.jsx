import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function RutaProtegida({ children }) {
  const { user, isLoading } = useContext(UserContext);

  if (isLoading) return null;

  return user ? children : <Navigate to="/login" replace />;
}
