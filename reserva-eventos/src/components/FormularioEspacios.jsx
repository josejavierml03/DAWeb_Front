import React, { useState } from "react";

export default function SpaceForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    propietario: "",
    capacidad: "",
    direccion: "",
    descripcion: "",
    estado: "ACTIVO"
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // En una versión futura, enviar al back
    console.log("Espacio creado:", formData);
  };

  return (
    <div className="container mt-4">
      <h3>Crear Espacio Físico</h3>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required />
        <input className="form-control mb-2" type="text" name="propietario" placeholder="Propietario" onChange={handleChange} required />
        <input className="form-control mb-2" type="number" name="capacidad" placeholder="Capacidad" onChange={handleChange} required />
        <input className="form-control mb-2" type="text" name="direccion" placeholder="Dirección" onChange={handleChange} required />
        <textarea className="form-control mb-2" name="descripcion" placeholder="Descripción" onChange={handleChange}></textarea>
        <select className="form-select mb-3" name="estado" onChange={handleChange}>
          <option value="ACTIVO">ACTIVO</option>
          <option value="CERRADO">CERRADO</option>
        </select>
        <button className="btn btn-primary" type="submit">Crear</button>
      </form>

      {submitted && (
        <div className="alert alert-success mt-4">
          <strong>Espacio creado:</strong><br />
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}