import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export default function SpaceForm() {

  const { user } = useContext(UserContext);
  
  const [formData, setFormData] = useState({
    nombre: "",
    propietario: "",
    capacidad: "",
    direccion: "",
    descripcion: "",
    estado: "ACTIVO"
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.nombreCompleto) {
      setFormData(prev => ({ ...prev, propietario: user.nombreCompleto }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    setError("");

    try {
      await axios.post("http://localhost:8090/espacios", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error al crear espacio:", err);
      setError("No se pudo crear el espacio. Verifica tus datos o tu sesión.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Crear Espacio Físico</h3>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required />
        <input className="form-control mb-2" type="text" name="propietario" value={formData.propietario} readOnly disabled />
        <input className="form-control mb-2" type="number" name="capacidad" placeholder="Capacidad" onChange={handleChange} required />
        <input className="form-control mb-2" type="text" name="direccion" placeholder="Dirección" onChange={handleChange} required />
        <textarea className="form-control mb-2" name="descripcion" placeholder="Descripción" onChange={handleChange}></textarea>
        <select className="form-select mb-3" name="estado" onChange={handleChange} value={formData.estado}>
          <option value="ACTIVO">ACTIVO</option>
          <option value="CERRADO">CERRADO</option>
        </select>
        <button className="btn btn-primary" type="submit">Crear</button>
      </form>

      {submitted && (
        <div className="alert alert-success mt-4">
          Espacio creado correctamente.
        </div>
      )}
      {error && (
        <div className="alert alert-danger mt-4">
          {error}
        </div>
      )}
    </div>
  );
}
