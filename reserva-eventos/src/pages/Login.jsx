import React, { useState,useEffect,useContext } from "react";
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
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const form = new URLSearchParams();
      form.append("username", username);
      form.append("password", password);

      const response = await axios.post("http://localhost:8090/auth/login", form, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        withCredentials: true 
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
    <div className="container mt-5">
      <h2>Iniciar Sesión</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" className="form-control mb-2" placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" className="form-control mb-2" placeholder="Clave" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="btn btn-primary">Entrar</button>
      </form>
      
      <hr />

      <button
        className="btn btn-dark"
        onClick={() => window.location.href = "http://localhost:8090/oauth2/authorization/github"}
      >
        Iniciar sesión con GitHub
      </button>
    </div>
  );
}
