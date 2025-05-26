import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container mt-5">
      <div className="p-5 mb-4 bg-light rounded-3 shadow w-80 mx-auto">
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

      <div className="row text-center mt-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body py-3 px-3">
              <h5 className="card-title">📅 Eventos</h5>
              <p className="card-text">
                Consulta los eventos programados y descubre nuevas actividades.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mt-4 mt-md-0">
          <div className="card border-0 shadow-sm">
            <div className="card-body py-3 px-3">
              <h5 className="card-title">🏛️ Espacios</h5>
              <p className="card-text">
                Explora los espacios físicos disponibles y conoce sus capacidades.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mt-4 mt-md-0">
          <div className="card border-0 shadow-sm">
            <div className="card-body py-3 px-3">
              <h5 className="card-title">🔐 Acceso Gestores</h5>
              <p className="card-text">
                Administra espacios y eventos si tienes rol de gestor o propietario.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}