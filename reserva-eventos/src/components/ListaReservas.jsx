import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

export default function ReservationList({ tipo = "todas" }) {
  const { user } = useContext(UserContext);
  const [reservasActivas, setReservasActivas] = useState([]);
  const [reservasFinalizadas, setReservasFinalizadas] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservas = async () => {
      if (!user?.nombreCompleto) return;

      try {
        const res = await axios.get(`http://localhost:8090/reservas/usuario/${user.nombreCompleto}`, {
          withCredentials: true,
        });

        const reservasCrudas = res.data;

        const reservasConEvento = await Promise.all(
          reservasCrudas.map(async (reserva) => {
            const match = reserva.evento.match(/id=([^,]+)/);
            const eventoId = match ? match[1] : null;

            if (!eventoId)
              return { ...reserva, nombreEvento: "Desconocido", fechaFin: null, activa: false };

            try {
              const eventoRes = await axios.get(`http://localhost:8090/eventos/${eventoId}`, {
                withCredentials: true,
              });
              const evento = eventoRes.data;
              const ahora = new Date();
              const fin = new Date(evento.fechaFin);
              return {
                ...reserva,
                nombreEvento: evento.nombre,
                fechaFin: evento.fechaFin,
                activa: fin > ahora && !reserva.cancelada
              };
            } catch {
              return {
                ...reserva,
                nombreEvento: "Evento no encontrado",
                fechaFin: null,
                activa: false
              };
            }
          })
        );

        setReservasActivas(reservasConEvento.filter((r) => r.activa));
        setReservasFinalizadas(reservasConEvento.filter((r) => !r.activa || r.cancelada));
      } catch (err) {
        console.error("Error al obtener reservas:", err);
        setError("No se pudieron cargar las reservas.");
      }
    };

    fetchReservas();
  }, [user]);

  const anularReserva = async (idReserva) => {
    try {
      await axios.patch(`http://localhost:8090/reservas/cancelada/${idReserva}`, {}, {
        withCredentials: true
      });

      // Mover de activas a finalizadas
      const cancelada = reservasActivas.find(r => r.id === idReserva);
      if (cancelada) {
        cancelada.cancelada = true;
        cancelada.activa = false;
        setReservasActivas(prev => prev.filter(r => r.id !== idReserva));
        setReservasFinalizadas(prev => [...prev, cancelada]);
      }
    } catch (error) {
      console.error("Error al anular la reserva:", error);
      setError("No se pudo anular la reserva.");
    }
  };

  const renderReserva = (res) => (
    <li key={res.id} className="list-group-item">
      <p><strong>Usuario:</strong> {res.idUsuario}</p>
      <p><strong>Plazas reservadas:</strong> {res.plazasReservadas}</p>
      <p><strong>Evento:</strong> {res.nombreEvento}</p>
      <p><strong>Fecha fin:</strong> {res.fechaFin || "No disponible"}</p>
      <span className={`badge ${res.cancelada ? "bg-danger" : res.activa ? "bg-success" : "bg-secondary"}`}>
        {res.cancelada ? "Cancelada" : res.activa ? "Activa" : "Finalizada"}
      </span>
      {res.activa && (
        <button
          className="btn btn-danger btn-sm mt-2 ms-3"
          onClick={() => anularReserva(res.id)}
        >
          Anular Reserva
        </button>
      )}
    </li>
  );

  return (
    <div className="container mt-4">
      <h3>Mis Reservas</h3>
      {error && <p className="text-danger">{error}</p>}

      {(tipo === "activas" || tipo === "todas") && (
        <>
          <h5 className="mt-4">Reservas Activas</h5>
          {reservasActivas.length === 0 ? (
            <p>No tienes reservas activas.</p>
          ) : (
            <ul className="list-group">{reservasActivas.map(renderReserva)}</ul>
          )}
        </>
      )}

      {(tipo === "finalizadas" || tipo === "todas") && (
        <>
          <h5 className="mt-4">Reservas Finalizadas</h5>
          {reservasFinalizadas.length === 0 ? (
            <p>No tienes reservas finalizadas.</p>
          ) : (
            <ul className="list-group">{reservasFinalizadas.map(renderReserva)}</ul>
          )}
        </>
      )}
    </div>
  );
}
