import React from "react";
import Nav from "../common/Nav";

const Nosotros = () => {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", color: "#1f2937" }}>
      <Nav />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 16px" }}>
        <h1 style={{ fontSize: 32, marginTop: 0 }}>Quiénes somos</h1>
        <p style={{ fontSize: 16, color: "#4b5563" }}>
          Somos un equipo apasionado por el café, la panadería artesanal y la atención cercana.
          Trabajamos con productores locales para ofrecer calidad en cada taza.
        </p>
      </main>
    </div>
  );
};

export default Nosotros;
