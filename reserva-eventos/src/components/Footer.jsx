import React from "react";

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-5 pt-4" style={{ minHeight: "96px" }}>
      <div className="container text-center">
        <p className="mb-1">© {new Date().getFullYear()} ReservasApp. Todos los derechos reservados.</p>
        <small>
          Desarrollado para la práctica de DAWeb — <a href="https://github.com/josejavierml03/DAWeb_Front" target="_blank" rel="noopener noreferrer" className="text-white text-decoration-underline">GitHub</a>
        </small>
      </div>
    </footer>
  );
}