import React from "react";
import Nav from "../common/Nav";
import { Link } from "react-router-dom";

const AdminPanel = () => {
  const card = {
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: 16,
    textDecoration: "none",
    color: "#111827",
    background: "white",
  };

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", color: "#1f2937" }}>
      <Nav />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 16px" }}>
        <h1 style={{ fontSize: 32, marginTop: 0 }}>Panel de administración</h1>
        <p style={{ color: "#6b7280" }}>Accedé a las herramientas de gestión.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16, marginTop: 16 }}>
          <Link to="/admin/usuarios" style={card}>Usuarios</Link>
          <Link to="/admin/usuario" style={card}>Crear usuario</Link>
          <Link to="/admin/cargos" style={card}>Cargos</Link>
          <Link to="/admin/almacenes" style={card}>Almacenes</Link>
          <Link to="/admin/ingredientes" style={card}>Ingredientes</Link>
          <Link to="/admin/menus" style={card}>Menús</Link>
          <Link to="/admin/comidas" style={card}>Comidas</Link>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;


