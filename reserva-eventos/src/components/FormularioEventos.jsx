import React, { useState } from "react";

export default function EventForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    organizador: "",
    categoria: "ACADEMICOS",
    cancelado: false,
    fechaInicio: "",
    fechaFin: "",
    espacio: "",
    plazas: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // En una versión futura, enviar al back
    console.log("Evento creado:", formData);
  };

  return (
    <div className="container mt-4">
      <h3>Crear Evento</h3>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" type="text" name="nombre" placeholder="Nombre del evento" onChange={handleChange} required />
        <textarea className="form-control mb-2" name="descripcion" placeholder="Descripción" onChange={handleChange}></textarea>
        <input className="form-control mb-2" type="text" name="organizador" placeholder="Organizador" onChange={handleChange} required />
        <input className="form-control mb-2" type="number" name="plazas" placeholder="Número de plazas" onChange={handleChange} required />
        <select className="form-select mb-2" name="categoria" onChange={handleChange}>
          <option value="ACADEMICOS">Académicos</option>
          <option value="CULTURALES">Culturales</option>
          <option value="ENTRETENIMIENTO">Entretenimiento</option>
          <option value="DEPORTES">Deportes</option>
          <option value="OTROS">Otros</option>
        </select>
        <input className="form-control mb-2" type="date" name="fechaInicio" onChange={handleChange} required />
        <input className="form-control mb-2" type="date" name="fechaFin" onChange={handleChange} required />
        <input className="form-control mb-2" type="text" name="espacio" placeholder="Nombre del espacio físico" onChange={handleChange} required />
        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" name="cancelado" onChange={handleChange} />
          <label className="form-check-label">¿Evento cancelado?</label>
        </div>
        <button className="btn btn-primary" type="submit">Crear</button>
      </form>

      {submitted && (
        <div className="alert alert-success mt-4">
          <strong>Evento creado:</strong><br />
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
