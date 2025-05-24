import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export default function ListaEventos() {
  const { user } = useContext(UserContext);
  const [eventos, setEventos] = useState([]);
  const [eventosFiltradosAplicados, setEventosFiltradosAplicados] = useState([]);
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
  const [filtros, setFiltros] = useState({
    nombre: "",
    categoria: "",
    espacio: "",
    propietario: "",
    minPlazas: ""
  });

  const roles = user?.roles?.split(",") || [];
  const esGestor = roles.includes("GESTOR_EVENTOS") || roles.includes("PROPIETARIO_ESPACIOS");
  const esUsuario = roles.includes("USUARIO");

  const now = new Date();
  const mes = now.getMonth() + 1;
  const año = now.getFullYear();

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

 const aplicarFiltros = () => {
  if (esUsuario) {
    const normalizar = (str) =>
      str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    const filtrados = eventos.filter((evento) => {
      const nombreNorm = normalizar(evento.nombre);
      const categoriaNorm = normalizar(evento.categoria);
      const espacioNorm = normalizar(evento.espacio?.nombre);
      const propietarioNorm = normalizar(evento.espacio?.propietario);

      const filtroNombre = normalizar(filtros.nombre);
      const filtroCategoria = normalizar(filtros.categoria);
      const filtroEspacio = normalizar(filtros.espacio);
      const filtroPropietario = normalizar(filtros.propietario);

      const matchNombre = !filtroNombre || nombreNorm === filtroNombre;
      const matchCategoria = !filtroCategoria || categoriaNorm === filtroCategoria;
      const matchEspacio = !filtroEspacio || espacioNorm === filtroEspacio;
      const matchPropietario = !filtroPropietario || propietarioNorm === filtroPropietario;
      const matchPlazas = !filtros.minPlazas || (evento.plazas && parseInt(evento.plazas) >= parseInt(filtros.minPlazas));

      return matchNombre && matchCategoria && matchEspacio && matchPropietario && matchPlazas;
    });

    setEventosFiltradosAplicados(filtrados);
  } else {
    setEventosFiltradosAplicados(eventos);
  }
};






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

        const eventosConDatos = await Promise.all(
          eventosEmbed.map(async (evento) => {
            try {
              const detalle = await axios.get(`http://localhost:8090/eventos/${evento.id}`, {
                withCredentials: true
              });

              const espacioId = detalle.data.espacioFisicoId;
              let espacio = null;

              if (espacioId) {
                const resEspacio = await axios.get(`http://localhost:8090/espacios/${espacioId}`, {
                  withCredentials: true
                });
                espacio = resEspacio.data;
              }

              return {
                ...evento,
                cancelado: detalle.data.cancelado === true,
                idEspacio: espacioId,
                espacio,
                nombre: detalle.data.nombre,
                categoria: detalle.data.categoria,
                fechaInicio: detalle.data.fechaInicio,
                fechaFin: detalle.data.fechaFin,
                descripcion: detalle.data.descripcion,
                plazas: detalle.data.plazas
              };
            } catch (err) {
              console.error(`Error en evento ${evento.id}:`, err);
              return {
                ...evento,
                cancelado: false,
                espacio: null
              };
            }
          })
        );

        setEventos(eventosConDatos);
        setEventosFiltradosAplicados(eventosConDatos);
      } catch (err) {
        console.error("Error al obtener eventos:", err);
        setError("No se pudieron cargar los eventos.");
      }
    };

    fetchEventos();
  }, [esUsuario]);

  useEffect(() => {
    if (eventos.length > 0) aplicarFiltros();
  }, [eventos]);


  useEffect(() => {
    const { fechaInicio, fechaFin, plazas } = formEdit;
    if (fechaInicio && fechaFin && plazas) {
      axios.get("http://localhost:8090/espacios/libres", {
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
          e.id === id ? { ...e, ...formEdit, fechaInicio: formEdit.fechaInicio, fechaFin: formEdit.fechaFin } : e
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

      if (![200, 204].includes(patchRes.status)) {
        setError("Evento no cancelado.");
        return;
      }

      setEventos((prev) =>
        prev.map((e) => (e.id === id ? { ...e, cancelado: true } : e))
      );
    } catch (err) {
      console.error("Error al cancelar el evento:", err);
      setError("Evento no cancelado.");
    }
  };

  return (
    <div className="mt-4">
      <h3>Lista de Eventos</h3>
      {esUsuario && (
        <div className="card p-3 mb-4">
          <h5>Filtros</h5>
          <div className="row">
            <div className="col-md-2">
              <input className="form-control mb-2" name="nombre" placeholder="Nombre" value={filtros.nombre} onChange={handleFiltroChange} />
            </div>
            <div className="col-md-2">
              <input className="form-control mb-2" name="categoria" placeholder="Categoría" value={filtros.categoria} onChange={handleFiltroChange} />
            </div>
            <div className="col-md-2">
              <input className="form-control mb-2" name="espacio" placeholder="Espacio" value={filtros.espacio} onChange={handleFiltroChange} />
            </div>
            <div className="col-md-2">
              <input className="form-control mb-2" name="propietario" placeholder="Propietario" value={filtros.propietario} onChange={handleFiltroChange} />
            </div>
            <div className="col-md-2">
              <input className="form-control mb-2" name="minPlazas" type="number" placeholder="Plazas mínimas" value={filtros.minPlazas} onChange={handleFiltroChange} />
            </div>
          </div>
          <button className="btn btn-primary mt-2" onClick={aplicarFiltros}>Aplicar filtros</button>
        </div>
      )}
      {error && <p className="text-danger">{error}</p>}
      {eventosFiltradosAplicados.length === 0 ? (
        <p>No hay eventos disponibles.</p>
      ) : (
        <ul className="list-group">
          {eventosFiltradosAplicados.map((evento) => (
            <li key={evento.id} className="list-group-item">
              {editandoId === evento.id ? (
                <div>
                  <input type="datetime-local" name="fechaInicio" className="form-control mb-2" value={formEdit.fechaInicio} onChange={handleChange} />
                  <input type="datetime-local" name="fechaFin" className="form-control mb-2" value={formEdit.fechaFin} onChange={handleChange} />
                  <input type="number" name="plazas" className="form-control mb-2" value={formEdit.plazas} onChange={handleChange} />
                  <textarea name="descripcion" className="form-control mb-2" value={formEdit.descripcion} onChange={handleChange} />
                  <select name="idEspacio" className="form-select mb-2" value={formEdit.idEspacio} onChange={handleChange} required>
                    <option value="">Selecciona un espacio</option>
                    {espaciosLibres.map((esp) => (
                      <option key={esp.es.id} value={esp.es.id}>{esp.es.nombre} (Capacidad: {esp.es.capacidad})</option>
                    ))}
                  </select>
                  <button className="btn btn-success btn-sm me-2" onClick={() => handleSave(evento.id)}>Guardar</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditandoId(null)}>Cancelar</button>
                </div>
              ) : (
                <div>
                  <strong>{evento.nombre}</strong> ({evento.categoria})<br />
                  📍 {evento.nombreEspacioFisico} - {evento.direccionEspacioFisico}<br />
                  🗓️ {evento.fechaInicio}<br />
                  {esUsuario && evento.espacio && (
                    <div className="mt-2 ps-2 border-start border-2">
                      <p className="mb-1"><strong>Espacio Físico:</strong> {evento.espacio.nombre}</p>
                      <p className="mb-1"><strong>Descripción:</strong> {evento.espacio.descripcion}</p>
                      <p className="mb-1"><strong>Dirección:</strong> {evento.espacio.direccion}</p>
                      <p className="mb-1"><strong>Capacidad:</strong> {evento.espacio.capacidad}</p>
                      <p className="mb-1"><strong>Propietario:</strong> {evento.espacio.propietario}</p>
                      <p className="mb-1"><strong>Estado:</strong> {evento.espacio.estado}</p>
                    </div>
                  )}
                  {esGestor && (
                    <>
                      <button className="btn btn-warning btn-sm mt-2 me-2" onClick={() => handleEditClick(evento)}>Editar</button>
                      {!evento.cancelado && (
                        <button className="btn btn-danger btn-sm mt-2" onClick={() => handleCancelarEvento(evento.id)}>Cancelar evento</button>
                      )}
                    </>
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
