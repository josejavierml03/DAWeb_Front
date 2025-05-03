import React from "react";
import { useNavigate } from "react-router-dom";
import FormularioEspacios from "../components/FormularioEspacios";
import FormularioEventos from "../components/FormularioEventos";

export default function AdminView() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="container mt-4">
      <h2>Panel del Gestor</h2>
      <p>Bienvenido, administrador. Aquí podrás gestionar espacios y eventos.</p>

      <div className="container mt-4">
        <button className="btn btn-primary me-3">Crear Espacio Físico</button>
        <button className="btn btn-secondary me-3">Crear Evento</button>
        <button className="btn btn-outline-danger" onClick={handleLogout}>Cerrar Sesión</button>
      </div>

      <div className="container mt-4">
        <FormularioEspacios />
        <FormularioEventos />
      </div>
    </div>
  );
}