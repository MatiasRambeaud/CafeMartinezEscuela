import React from "react";
import Nav from "../common/Nav";

const Contacto = () => {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", color: "#1f2937" }}>
      <Nav />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 16px" }}>
        <h1 style={{ fontSize: 32, marginTop: 0 }}>Contacto</h1>
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ color: "#4b5563" }}>Correo: contacto@cafemartinez.com</div>
          <div style={{ color: "#4b5563" }}>Teléfono: +54 9 11 1234-5678</div>
          <div style={{ color: "#4b5563" }}>Dirección: Av. Siempre Viva 742, Buenos Aires</div>
        </div>
      </main>
    </div>
  );
};

export default Contacto;
