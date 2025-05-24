import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import FormularioEspacios from "../components/FormularioEspacios";
import FormularioEventos from "../components/FormularioEventos";
import ListaEspacios from "../components/ListaEspacios";
import ListaEventos from "../components/ListaEventos"; 
import { UserContext } from "../components/UserContext";

export default function AdminView() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [mostrarFormularioEspacios, setMostrarFormularioEspacios] = useState(false);
  const [mostrarFormularioEventos, setMostrarFormularioEventos] = useState(false);
  const [mostrarListaEspacios, setMostrarListaEspacios] = useState(false); 
  const [mostrarListaEventos, setMostrarListaEventos] = useState(false);  

  return (
    <div className="container mt-4">
      <h2>Panel del Gestor</h2>
      <p>Bienvenido, administrador. Aquí podrás gestionar espacios y eventos.</p>

      <div className="container mt-4">
        <button
          className="btn btn-primary me-3"
          onClick={() => setMostrarFormularioEspacios(!mostrarFormularioEspacios)}
        >
          {mostrarFormularioEspacios ? "Ocultar" : "Crear Espacio Físico"}
        </button>

        <button
          className="btn btn-secondary me-3"
          onClick={() => setMostrarFormularioEventos(!mostrarFormularioEventos)}
        >
          {mostrarFormularioEventos ? "Ocultar" : "Crear Evento"}
        </button>

        <button
          className="btn btn-outline-primary me-3"
          onClick={() => setMostrarListaEspacios(!mostrarListaEspacios)}
        >
          {mostrarListaEspacios ? "Ocultar Lista de Espacios" : "Ver Lista de Espacios"}
        </button>

        <button
          className="btn btn-outline-secondary"
          onClick={() => setMostrarListaEventos(!mostrarListaEventos)}
        >
          {mostrarListaEventos ? "Ocultar Lista de Eventos" : "Ver Lista de Eventos"}
        </button>
      </div>

      <div className="container mt-4">
        {mostrarFormularioEspacios && <FormularioEspacios />}
        {mostrarFormularioEventos && <FormularioEventos />}
      </div>

      {user?.nombreCompleto && (
        <div className="container mt-5">
          {mostrarListaEspacios && (
            <div className="mb-4">
              <h4>Espacios del propietario: {user.nombreCompleto}</h4>
              <ListaEspacios propietario={user.nombreCompleto} />
            </div>
          )}

          {mostrarListaEventos && (
            <div>
              <h4>Eventos del mes actual</h4>
              <ListaEventos />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
