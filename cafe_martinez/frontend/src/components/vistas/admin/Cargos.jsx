import React, { useEffect, useState } from "react";
import Nav from "../../common/Nav";

const Cargos = () => {
  const [items, setItems] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:3000/api/cargos");
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError("No se pudieron cargar los cargos. Verificar backend en puerto 3000.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    try {
      setLoading(true);
      setError("");
      if (editId) {
        const res = await fetch(`http://localhost:3000/api/cargos/${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ Nombre_Cargo: nombre }) });
        if (!res.ok) throw new Error();
      } else {
        const res = await fetch("http://localhost:3000/api/cargos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ Nombre_Cargo: nombre }) });
        if (!res.ok) throw new Error();
      }
      setNombre("");
      setEditId(null);
      await load();
    } catch (_) {
      setError("No se pudo guardar el cargo.");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar cargo?")) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`http://localhost:3000/api/cargos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      await load();
    } catch (_) {
      setError("No se pudo eliminar el cargo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", color: "#1f2937" }}>
      <Nav />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 16px" }}>
        <h1 style={{ fontSize: 28, marginTop: 0 }}>Cargos</h1>
        {error && <div style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</div>}
        {loading && <div style={{ color: "#6b7280", marginBottom: 12 }}>Cargando...</div>}
        <form onSubmit={save} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del cargo" style={{ flex: 1, padding: 8, border: "1px solid #d1d5db", borderRadius: 8 }} />
          <button type="submit" style={{ padding: "8px 12px", borderRadius: 8, background: "#111827", color: "white", border: 0 }}>{editId ? "Actualizar" : "Agregar"}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setNombre(""); }} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db", background: "white" }}>Cancelar</button>}
        </form>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>ID_Cargo</th>
              <th style={th}>Nombre_Cargo</th>
              <th style={th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.ID_Cargo}>
                <td style={td}>{c.ID_Cargo}</td>
                <td style={td}>{c.Nombre_Cargo}</td>
                <td style={td}>
                  <button onClick={() => { setEditId(c.ID_Cargo); setNombre(c.Nombre_Cargo); }} style={btn}>Editar</button>
                  <button onClick={() => remove(c.ID_Cargo)} style={{ ...btn, background: "#f43f5e" }}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

const th = { textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: 8 };
const td = { borderBottom: "1px solid #f3f4f6", padding: 8 };
const btn = { padding: "6px 10px", borderRadius: 8, border: 0, background: "#111827", color: "white", marginRight: 8 };

export default Cargos;


