import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ListaEventos from "../components/ListaEventos";
import ListaReservas from "../components/ListaReservas";
import FormularioReserva from "../components/FormularioReservas";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [mostrarEventos, setMostrarEventos] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarActivas, setMostrarActivas] = useState(false);
  const [mostrarFinalizadas, setMostrarFinalizadas] = useState(false);

  return (
    <div className="container mt-4">
      <h2>Panel del Usuario</h2>
      <p>Bienvenido, aquí puedes ver y reservar eventos.</p>

      <div className="mt-4 d-flex flex-wrap gap-2">
        <button className="btn btn-info" onClick={() => setMostrarEventos(!mostrarEventos)}>
          {mostrarEventos ? "Ocultar Eventos" : "Mostrar Eventos"}
        </button>
        <button className="btn btn-success" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
          {mostrarFormulario ? "Ocultar Formulario Reserva" : "Mostrar Formulario Reserva"}
        </button>
        <button className="btn btn-primary" onClick={() => setMostrarActivas(!mostrarActivas)}>
          {mostrarActivas ? "Ocultar Reservas Activas" : "Mostrar Reservas Activas"}
        </button>
        <button className="btn btn-secondary" onClick={() => setMostrarFinalizadas(!mostrarFinalizadas)}>
          {mostrarFinalizadas ? "Ocultar Reservas Finalizadas" : "Mostrar Reservas Finalizadas"}
        </button>
      </div>

      <div className="container mt-4">
        {mostrarEventos && <ListaEventos />}
        {mostrarFormulario && <FormularioReserva />}
        {mostrarActivas && <ListaReservas tipo="activas" />}
        {mostrarFinalizadas && <ListaReservas tipo="finalizadas" />}
      </div>
    </div>
  );
}
