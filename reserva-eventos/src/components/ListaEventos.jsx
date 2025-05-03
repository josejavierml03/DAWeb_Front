import React from "react";

export default function EventList() {
  const eventos = [
    {
      id: 1,
      nombre: "Taller de React",
      descripcion: "Aprende React desde cero",
      fechaInicio: "2025-06-10",
      fechaFin: "2025-06-10",
      espacio: "Sala A",
      categoria: "ACADEMICOS",
      cancelado: false,
      plazasLibres: 20
    },
    {
      id: 2,
      nombre: "Concierto de Jazz",
      descripcion: "Música en vivo",
      fechaInicio: "2025-06-15",
      fechaFin: "2025-06-15",
      espacio: "Auditorio",
      categoria: "ENTRETENIMIENTO",
      cancelado: true,
      plazasLibres: 0
    }
  ];

  return (
    <div className="container mt-4">
      <h3>Eventos Disponibles</h3>
      {eventos.length === 0 ? (
        <p>No hay eventos.</p>
      ) : (
        <ul className="list-group">
          {eventos.map(evento => (
            <li key={evento.id} className={`list-group-item ${evento.cancelado ? "text-muted" : ""}`}>
              <strong>{evento.nombre}</strong> ({evento.categoria})<br />
              {evento.descripcion}<br />
              📍 {evento.espacio}<br />
              📅 {evento.fechaInicio} — {evento.fechaFin}<br />
              Plazas libres: {evento.plazasLibres}<br />
              {evento.cancelado && <span className="badge bg-danger">CANCELADO</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}