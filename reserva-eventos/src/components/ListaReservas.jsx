import React from "react";

export default function ReservationList() {
  const reservas = [
    {
      id: 1,
      evento: "Taller de React",
      fechaInicio: "2025-06-10",
      plazas: 2,
      activa: true
    },
    {
      id: 2,
      evento: "Concierto de Jazz",
      fechaInicio: "2025-06-15",
      plazas: 1,
      activa: false
    }
  ];

  return (
    <div className="container mt-4">
      <h3>Mis Reservas</h3>
      {reservas.length === 0 ? (
        <p>No tienes reservas.</p>
      ) : (
        <ul className="list-group">
          {reservas.map(res => (
            <li key={res.id} className="list-group-item">
              <strong>{res.evento}</strong><br />
              Fecha: {res.fechaInicio}<br />
              Plazas reservadas: {res.plazas}<br />
              {res.activa ? (
                <span className="badge bg-success">Activa</span>
              ) : (
                <span className="badge bg-secondary">Finalizada</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}