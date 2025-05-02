import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Usuarios falsos en memoria
    if (email === "admin@test.com" && clave === "1234") {
      navigate("/admin");
    } else if (email === "user@test.com" && clave === "1234") {
      navigate("/usuario");
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Iniciar Sesión (Demo)</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="email" className="form-control mb-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="form-control mb-2" placeholder="Clave" value={clave} onChange={(e) => setClave(e.target.value)} />
        <button type="submit" className="btn btn-primary">Entrar</button>
      </form>
    </div>
  );
}
