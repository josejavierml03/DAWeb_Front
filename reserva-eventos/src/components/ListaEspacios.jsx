import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export default function ListaEspacios() {
  const { user } = useContext(UserContext);
  const [espacios, setEspacios] = useState([]);
  const [error, setError] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [formEdit, setFormEdit] = useState({ nombre: "", capacidad: "", descripcion: "" });

  const fetchEspacios = async () => {
    try {
      const response = await axios.get("http://localhost:8090/espacios", {
        params: {
          propietario: user?.nombreCompleto,
        },
        withCredentials: true,
      });
      setEspacios(response.data.espacio || []);
    } catch (err) {
      console.error("Error al obtener espacios:", err);
      setError("No se pudieron cargar los espacios.");
    }
  };

  useEffect(() => {
    if (user?.nombreCompleto) {
      fetchEspacios();
    }
  }, [user]);

  const handleEditClick = (esp) => {
    setEditandoId(esp.es.id);
    setFormEdit({
      nombre: esp.es.nombre,
      capacidad: esp.es.capacidad,
      descripcion: esp.es.descripcion,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id) => {
  try {
    await axios.patch(`http://localhost:8090/espacios/${id}`, formEdit, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    setEspacios((prev) =>
      prev.map((esp) =>
        esp.es.id === id
          ? {
              ...esp,
              es: {
                ...esp.es,
                nombre: formEdit.nombre,
                capacidad: formEdit.capacidad,
                descripcion: formEdit.descripcion,
              },
            }
          : esp
      )
    );

    setEditandoId(null);
  } catch (err) {
    console.error("Error al actualizar espacio:", err);
    setError("No se pudo actualizar el espacio.");
  }
};

  return (
    <div className="mt-5">
      <h3>Lista de Espacios</h3>
      {error && <p className="text-danger">{error}</p>}
      {espacios.length === 0 && <p>No hay espacios para mostrar.</p>}
      <ul className="list-group">
        {espacios.map((esp) => (
          <li key={esp.es.id} className="list-group-item">
            {editandoId === esp.es.id ? (
              <div>
                <input
                  className="form-control mb-2"
                  name="nombre"
                  value={formEdit.nombre}
                  onChange={handleChange}
                />
                <input
                  className="form-control mb-2"
                  name="capacidad"
                  type="number"
                  value={formEdit.capacidad}
                  onChange={handleChange}
                />
                <textarea
                  className="form-control mb-2"
                  name="descripcion"
                  value={formEdit.descripcion}
                  onChange={handleChange}
                />
                <button className="btn btn-success btn-sm me-2" onClick={() => handleSave(esp.es.id)}>Guardar</button>
                <button className="btn btn-secondary btn-sm" onClick={() => setEditandoId(null)}>Cancelar</button>
              </div>
            ) : (
              <div>
                <h5>{esp.es.nombre}</h5>
                <p>{esp.es.descripcion}</p>
                <p><strong>Capacidad:</strong> {esp.es.capacidad}</p>
                <button className="btn btn-warning btn-sm" onClick={() => handleEditClick(esp)}>Editar</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
