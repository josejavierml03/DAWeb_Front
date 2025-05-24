import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export default function EventForm() {
  const { user } = useContext(UserContext);
  const [espacios, setEspacios] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    organizador: "",
    categoria: "ACADEMICOS",
    fechaInicio: "",
    fechaFin: "",
    idEspacio: "",
    plazas: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Manejo de cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Petición a espacios/libres cuando hay datos suficientes
  useEffect(() => {
    const { fechaInicio, fechaFin, plazas } = formData;
    
    if (fechaInicio && fechaFin && plazas) {
      axios.get("http://localhost:8090/espacios/libres", {
        params: {
          fechaInicio: `${fechaInicio}T00:00:00`,
          fechaFin: `${fechaFin}T00:00:00`,
          capacidad: parseInt(formData.plazas)
        },
        withCredentials: true
      })
      .then(res => {
        setEspacios(res.data.espacio || []);
      })
      .catch(err => {
        console.error("Error al cargar espacios libres:", err);
        setError("No se pudieron cargar los espacios físicos.");
      });
    }
  }, [formData.fechaInicio, formData.fechaFin, formData.plazas]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    setError("");

    try {
      await axios.post("http://localhost:8090/eventos", {
        ...formData,
        fechaInicio: formData.fechaInicio + "T00:00:00",
        fechaFin: formData.fechaFin + "T00:00:00",
      }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error al crear evento:", err);
      setError("No se pudo crear el evento.");
    }
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

        <select className="form-select mb-2" name="idEspacio" onChange={handleChange} required>
          <option value="">Selecciona un espacio físico</option>
          {espacios.map((e) => (
            <option key={e.es.id} value={e.es.id}>
              {e.es.nombre} - Capacidad: {e.es.capacidad}
            </option>
          ))}
        </select>

        <button className="btn btn-primary" type="submit">Crear</button>
      </form>

      {submitted && <div className="alert alert-success mt-4">Evento creado correctamente.</div>}
      {error && <div className="alert alert-danger mt-4">{error}</div>}
    </div>
  );
}
