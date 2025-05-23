import React, { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import FormularioEspacios from "../components/FormularioEspacios";
import FormularioEventos from "../components/FormularioEventos";
import ListaEspacios from "../components/ListaEspacios";
import { UserContext } from "../components/UserContext";

export default function AdminView() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [mostrarFormularioEspacios, setMostrarFormularioEspacios] = useState(false);
  const [mostrarFormularioEventos, setMostrarFormularioEventos] = useState(false);

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
      </div>

      <div className="container mt-4">
        {mostrarFormularioEspacios && <FormularioEspacios />}
        {mostrarFormularioEventos && <FormularioEventos />}
      </div>
      {user?.nombreCompleto && (
        <div className="container mt-5">
          <ListaEspacios propietario={user.nombreCompleto} />
        </div>
      )}
    </div>
  );
}