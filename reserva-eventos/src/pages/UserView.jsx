import React from "react";
import { useNavigate } from "react-router-dom";
import ListaEventos from "../components/ListaEventos";
import ListaReservas from "../components/ListaReservas";

export default function UserDashboard() {
  const navigate = useNavigate();


  return (
    <div className="container mt-4">
      <h2>Panel del Usuario</h2>
      <p>Bienvenido, aquí puedes ver y reservar eventos.</p>

      <div className="mt-4">
        <button className="btn btn-primary me-3">Ver Eventos</button>
        <button className="btn btn-secondary me-3">Mis Reservas</button>
      </div>
       <div className="container mt-4">
              <ListaEventos />
              <ListaReservas />
        </div>
    </div>
  );
}