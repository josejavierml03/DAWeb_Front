import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
  axios.post("http://localhost:8090/auth/logout", {}, {
    withCredentials: true
  }).then(() => {
    setUser(null);
    navigate("/login");
  }).catch(() => {
    setUser(null);
    navigate("/login");
  });
};

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#175f68" }}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">🎫 ReservasApp</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            {(user?.roles === "GESTOR_EVENTOS" || user?.roles === "PROPIETARIO_ESPACIOS") && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Administrador</Link>
              </li>
            )}
            {user?.roles === "USUARIO" && (
              <li className="nav-item">
                <Link className="nav-link" to="/usuario">Usuario</Link>
              </li>
            )}
          </ul>
           {user && (
            <div className="d-flex align-items-center text-white">
              <span className="me-3">Bienvenido, {user.nombreCompleto}</span>
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}