import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container mt-5">
      <div className="p-5 mb-4 bg-light rounded-3 shadow">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Bienvenido a la Web de Reservas</h1>
          <p className="col-md-8 fs-5">
            Gestiona espacios, consulta eventos y realiza tus reservas fácilmente.
          </p>
          <Link to="/login" className="btn btn-primary btn-lg">
            Empezar ahora
          </Link>
        </div>
      </div>
    </div>
  );
}