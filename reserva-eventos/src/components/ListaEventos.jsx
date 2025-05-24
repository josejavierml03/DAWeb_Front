import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export default function ListaEventos() {
  const { user } = useContext(UserContext);
  const [eventos, setEventos] = useState([]);
  const [error, setError] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [formEdit, setFormEdit] = useState({
    fechaInicio: "",
    fechaFin: "",
    plazas: "",
    idEspacio: "",
    descripcion: ""
  });
  const [espaciosLibres, setEspaciosLibres] = useState([]);

  const now = new Date();
  const mes = now.getMonth() + 1;
  const año = now.getFullYear();

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get("http://localhost:8090/eventos", {
          params: {
            mes,
            año,
            page: 0,
            size: 5,
            sort: "fechaInicio,asc"
          },
          withCredentials: true
        });

        const eventosEmbed = response.data._embedded?.eventoResumenList || [];

        const eventosConEstado = await Promise.all(
          eventosEmbed.map(async (evento) => {
            try {
              const resDetalle = await axios.get(`http://localhost:8090/eventos/${evento.id}`, {
                withCredentials: true
              });
              return { ...evento, cancelado: resDetalle.data.cancelado === true };
            } catch (err) {
              console.error(`Error al obtener estado del evento ${evento.id}:`, err);
              return { ...evento, cancelado: false };
            }
          })
        );

        setEventos(eventosConEstado);
      } catch (err) {
        console.error("Error al obtener eventos:", err);
        setError("No se pudieron cargar los eventos.");
      }
    };

    fetchEventos();
  }, []);

  useEffect(() => {
    const { fechaInicio, fechaFin, plazas } = formEdit;
    if (fechaInicio && fechaFin && plazas) {
      axios
        .get("http://localhost:8090/espacios/libres", {
          params: {
            fechaInicio,
            fechaFin,
            capacidad: parseInt(plazas)
          },
          withCredentials: true
        })
        .then((res) => {
          setEspaciosLibres(res.data.espacio || []);
        })
        .catch((err) => {
          console.error("Error al obtener espacios libres:", err);
          setEspaciosLibres([]);
        });
    }
  }, [formEdit.fechaInicio, formEdit.fechaFin, formEdit.plazas]);

  const handleEditClick = (evento) => {
    setEditandoId(evento.id);
    setFormEdit({
      fechaInicio: evento.fechaInicio.slice(0, 16),
      fechaFin: evento.fechaFin?.slice(0, 16),
      plazas: evento.plazas || "",
      idEspacio: evento.idEspacio || "",
      descripcion: evento.descipcion || ""
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id) => {
    const { fechaInicio, fechaFin, plazas, idEspacio, descripcion } = formEdit;

    if (!fechaInicio || !fechaFin || !plazas || !idEspacio || !descripcion) {
      setError("Por favor, completa todos los campos antes de guardar.");
      return;
    }

    if (parseInt(plazas) <= 0) {
      setError("El número de plazas debe ser mayor a 0.");
      return;
    }

    if (new Date(fechaInicio) >= new Date(fechaFin)) {
      setError("La fecha de inicio debe ser anterior a la fecha de fin.");
      return;
    }

    const espacioSeleccionado = espaciosLibres.find((esp) => esp.es.id === idEspacio);
    if (!espacioSeleccionado) {
      setError("No se pudo verificar la capacidad del espacio seleccionado.");
      return;
    }

    if (parseInt(plazas) > espacioSeleccionado.es.capacidad) {
      setError(`Las plazas (${plazas}) no pueden superar la capacidad del espacio (${espacioSeleccionado.es.capacidad}).`);
      return;
    }

    try {
      await axios.patch(`http://localhost:8090/eventos/${id}`, formEdit, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      setEventos((prev) =>
        prev.map((e) =>
          e.id === id
            ? {
                ...e,
                ...formEdit,
                fechaInicio: formEdit.fechaInicio,
                fechaFin: formEdit.fechaFin
              }
            : e
        )
      );
      setEditandoId(null);
      setError("");
    } catch (err) {
      console.error("Error al actualizar evento:", err);
      setError("No se pudo actualizar el evento.");
    }
  };

  const handleCancelarEvento = async (id) => {
    try {
      const patchRes = await axios.patch(`http://localhost:8090/eventos/${id}/ocupacion`, null, {
        withCredentials: true
      });

      if (patchRes.status !== 200 && patchRes.status !== 204) {
        setError("Evento no cancelado.");
        return;
      }
      setEventos((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, cancelado: true } : e
        )
      );
    } catch (err) {
      console.error("Error al cancelar el evento:", err);
      setError("Evento no cancelado.");
    }
  };

  return (
    <div className="mt-4">
      <h3>Lista de Eventos</h3>
      {error && <p className="text-danger">{error}</p>}
      {eventos.length === 0 ? (
        <p>No hay eventos disponibles.</p>
      ) : (
        <ul className="list-group">
          {eventos.map((evento) => (
            <li key={evento.id} className="list-group-item">
              {editandoId === evento.id ? (
                <div>
                  <input
                    type="datetime-local"
                    name="fechaInicio"
                    className="form-control mb-2"
                    value={formEdit.fechaInicio}
                    onChange={handleChange}
                  />
                  <input
                    type="datetime-local"
                    name="fechaFin"
                    className="form-control mb-2"
                    value={formEdit.fechaFin}
                    onChange={handleChange}
                  />
                  <input
                    type="number"
                    name="plazas"
                    className="form-control mb-2"
                    value={formEdit.plazas}
                    onChange={handleChange}
                  />
                  <textarea
                    name="descripcion"
                    className="form-control mb-2"
                    value={formEdit.descripcion}
                    onChange={handleChange}
                  />
                  <select
                    name="idEspacio"
                    className="form-select mb-2"
                    value={formEdit.idEspacio}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona un espacio</option>
                    {espaciosLibres.map((esp) => (
                      <option key={esp.es.id} value={esp.es.id}>
                        {esp.es.nombre} (Capacidad: {esp.es.capacidad})
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleSave(evento.id)}
                  >
                    Guardar
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setEditandoId(null)}
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div>
                  <strong>{evento.nombre}</strong> ({evento.categoria})<br />
                  📍 {evento.nombreEspacioFisico} - {evento.direccionEspacioFisico}<br />
                  📅 {evento.fechaInicio}<br />
                  <button
                    className="btn btn-warning btn-sm mt-2 me-2"
                    onClick={() => handleEditClick(evento)}
                  >
                    Editar
                  </button>
                  {!evento.cancelado && (
                    <button
                      className="btn btn-danger btn-sm mt-2"
                      onClick={() => handleCancelarEvento(evento.id)}
                    >
                      Cancelar evento
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
