import React from "react";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="container mt-4">
      <h2>Panel del Usuario</h2>
      <p>Bienvenido, aquí puedes ver y reservar eventos.</p>

      <div className="mt-4">
        <button className="btn btn-primary me-3">Ver Eventos</button>
        <button className="btn btn-secondary me-3">Mis Reservas</button>
        <button className="btn btn-outline-danger" onClick={handleLogout}>Cerrar Sesión</button>
      </div>

      {/* Aquí incluir componentes  */}
    </div>
  );
}