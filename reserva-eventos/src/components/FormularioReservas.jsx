import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export default function FormularioReserva() {
  const { user } = useContext(UserContext);
  const [eventos, setEventos] = useState([]);
  const [form, setForm] = useState({
    idEvento: "",
    plazas: ""
  });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const now = new Date();
    const mes = now.getMonth() + 1;
    const año = now.getFullYear();

    axios
      .get("http://localhost:8090/eventos", {
        params: {
          mes,
          año,
          page: 0,
          size: 5,
          sort: "fechaInicio,asc"
        },
        withCredentials: true
      })
      .then(async (res) => {
        const lista = res.data._embedded?.eventoResumenList || [];

        const eventosFiltrados = await Promise.all(
          lista.map(async (e) => {
            try {
              const detalle = await axios.get(`http://localhost:8090/eventos/${e.id}`, {
                withCredentials: true
              });

              const fechaFin = new Date(detalle.data.fechaFin);
              const cancelado = detalle.data.cancelado;
              const ahora = new Date();

              if (!cancelado && fechaFin > ahora) {
                return {
                  id: e.id,
                  nombre: e.nombre,
                  fechaFin: e.fechaFin,
                  fechaInicio: e.fechaInicio,
                  descripcion: e.descripcion
                };
              }
              return null;
            } catch {
              return null;
            }
          })
        );

        setEventos(eventosFiltrados.filter((e) => e !== null));
      })
      .catch(() => {
        setError("No se pudieron cargar los eventos.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!form.idEvento || !form.plazas || parseInt(form.plazas) <= 0) {
      setError("Debe seleccionar un evento y un número válido de plazas.");
      return;
    }

    try {
      await axios.post("http://localhost:8090/reservas", {
        idEvento: form.idEvento,
        idUsuario: user.nombreCompleto,
        plazas: parseInt(form.plazas)
      }, {
        withCredentials: true
      });

      setMensaje("Reserva realizada correctamente.");
      setForm({ idEvento: "", plazas: "" });
    } catch {
      setError("No se pudo realizar la reserva.");
    }
  };

  return (
    <div className="container mt-4">
      <h4>Realizar Reserva</h4>
      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <select
          className="form-select mb-3"
          name="idEvento"
          value={form.idEvento}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona un evento</option>
          {eventos.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre} - {new Date(e.fechaInicio).toLocaleDateString()}
            </option>
          ))}
        </select>

        <input
          className="form-control mb-3"
          type="number"
          name="plazas"
          value={form.plazas}
          onChange={handleChange}
          placeholder="Número de plazas"
          required
        />

        <button className="btn btn-primary" type="submit">
          Reservar
        </button>
      </form>
    </div>
  );
}
