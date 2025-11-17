import React, { useEffect, useState } from "react";
import Nav from "../../common/Nav";

const Almacenes = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ Nombre: "", Descripcion: "", ID_Usuario: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true); setError("");
      const res = await fetch("http://localhost:3000/api/almacenes");
      if (!res.ok) throw new Error();
      setItems(await res.json());
    } catch (_) {
      setError("No se pudieron cargar los almacenes.");
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); setError("");
      const url = editId ? `http://localhost:3000/api/almacenes/${editId}` : "http://localhost:3000/api/almacenes";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      setForm({ Nombre: "", Descripcion: "", ID_Usuario: "" });
      setEditId(null);
      await load();
    } catch (_) { setError("No se pudo guardar."); }
    finally { setLoading(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar almacén?")) return;
    try {
      setLoading(true); setError("");
      const res = await fetch(`http://localhost:3000/api/almacenes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      await load();
    } catch (_) { setError("No se pudo eliminar."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", color: "#1f2937" }}>
      <Nav />
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 16px" }}>
        <h1 style={{ fontSize: 28, marginTop: 0 }}>Almacenes</h1>
        {error && <div style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</div>}
        {loading && <div style={{ color: "#6b7280", marginBottom: 12 }}>Cargando...</div>}
        <form onSubmit={save} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
          <input name="Nombre" value={form.Nombre} onChange={onChange} placeholder="Nombre" style={input} />
          <input name="Descripcion" value={form.Descripcion} onChange={onChange} placeholder="Descripción" style={input} />
          <input name="ID_Usuario" value={form.ID_Usuario} onChange={onChange} placeholder="ID_Usuario" style={input} />
          <button type="submit" style={btnPrimary}>{editId ? "Actualizar" : "Agregar"}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ Nombre: "", Descripcion: "", ID_Usuario: "" }); }} style={btnGhost}>Cancelar</button>}
        </form>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>ID_Almacen</th>
              <th style={th}>Nombre</th>
              <th style={th}>Descripcion</th>
              <th style={th}>Stock Total (Suma de Ingredientes)</th>
              <th style={th}>ID_Usuario</th>
              <th style={th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.ID_Almacen}>
                <td style={td}>{a.ID_Almacen}</td>
                <td style={td}>{a.Nombre}</td>
                <td style={td}>{a.Descripcion}</td>
                <td style={td}>
                  <strong style={{ color: "#059669", fontSize: "16px" }}>
                    {parseInt(a.Stock_Total || 0).toLocaleString("es-AR")} unidades
                  </strong>
                </td>
                <td style={td}>{a.ID_Usuario}</td>
                <td style={td}>
                  <button onClick={() => { setEditId(a.ID_Almacen); setForm({ Nombre: a.Nombre, Descripcion: a.Descripcion, ID_Usuario: a.ID_Usuario }); }} style={btnPrimary}>Editar</button>
                  <button onClick={() => remove(a.ID_Almacen)} style={{ ...btnPrimary, background: "#f43f5e" }}>Borrar</button>
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
const input = { padding: 8, border: "1px solid #d1d5db", borderRadius: 8 };
const btnPrimary = { padding: "8px 12px", borderRadius: 8, border: 0, background: "#111827", color: "white" };
const btnGhost = { padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db", background: "white" };

export default Almacenes;


