import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../components/UserContext";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const form = new URLSearchParams();
      form.append("username", username);
      form.append("password", password);

      const response = await axios.post("http://localhost:8090/auth/login", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true,
      });

      const { roles, nombreCompleto } = response.data;
      setUser({ roles, nombreCompleto });
      navigate("/");
    } catch (err) {
      console.error("Error al hacer login:", err);
      setError("Credenciales incorrectas o servidor no disponible.");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "90vh" }}>
      <div className="card shadow-sm p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="text-center mb-4">
          <h4 className="mt-2">Portal de Entrada</h4>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              className="form-control"
              placeholder="usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-5">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-secondary w-100 mb-3">
            Acceder
          </button>
        </form>

        <div className="text-center mb-3">
          <span className="text-muted">──────── o ────────</span>
        </div>

        <button
          className="btn btn-outline-dark w-100"
          onClick={() => window.location.href = "http://localhost:8090/oauth2/authorization/github"}
        >
          Iniciar sesión con GitHub
        </button>
      </div>
    </div>
  );
}