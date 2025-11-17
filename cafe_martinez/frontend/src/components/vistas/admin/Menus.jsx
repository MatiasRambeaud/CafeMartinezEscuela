import React, { useEffect, useState } from "react";
import Nav from "../../common/Nav";

const Menus = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ fecha: "", CHEF_ID: "", activo: false });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try { setLoading(true); setError("");
      const res = await fetch("http://localhost:3000/api/menus");
      if (!res.ok) throw new Error();
      setItems(await res.json());
    } catch (_) { setError("No se pudieron cargar los menús."); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const onChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const save = async (e) => {
    e.preventDefault();
    try { setLoading(true); setError("");
      const url = editId ? `http://localhost:3000/api/menus/${editId}` : "http://localhost:3000/api/menus";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      setForm({ fecha: "", CHEF_ID: "", activo: false });
      setEditId(null);
      await load();
    } catch (_) { setError("No se pudo guardar."); }
    finally { setLoading(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar menú?")) return;
    try { setLoading(true); setError("");
      const res = await fetch(`http://localhost:3000/api/menus/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      await load();
    } catch (_) { setError("No se pudo eliminar."); }
    finally { setLoading(false); }
  };

  const activarMenu = async (id) => {
    try { setLoading(true); setError("");
      const res = await fetch(`http://localhost:3000/api/menus/${id}/activar`, { method: "PUT" });
      if (!res.ok) throw new Error();
      await load();
    } catch (_) { setError("No se pudo activar el menú."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", color: "#1f2937" }}>
      <Nav />
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 16px" }}>
        <h1 style={{ fontSize: 28, marginTop: 0 }}>Menús</h1>
        {error && <div style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</div>}
        {loading && <div style={{ color: "#6b7280", marginBottom: 12 }}>Cargando...</div>}
        <form onSubmit={save} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
          <input name="fecha" type="date" value={form.fecha} onChange={onChange} placeholder="Fecha" style={input} required />
          <input name="CHEF_ID" type="number" value={form.CHEF_ID} onChange={onChange} placeholder="CHEF_ID" style={input} required />
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input name="activo" type="checkbox" checked={form.activo} onChange={onChange} />
            <span>Activo (mostrar a clientes)</span>
          </label>
          <button type="submit" style={btnPrimary}>{editId ? "Actualizar" : "Agregar"}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ fecha: "", CHEF_ID: "", activo: false }); }} style={btnGhost}>Cancelar</button>}
        </form>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>ID_Menu</th>
              <th style={th}>Fecha</th>
              <th style={th}>CHEF_ID</th>
              <th style={th}>Activo</th>
              <th style={th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((x) => (
              <tr key={x.ID_Menu} style={{ background: x.activo ? "#d1fae5" : "transparent" }}>
                <td style={td}>{x.ID_Menu}</td>
                <td style={td}>{x.fecha?.slice(0,10)}</td>
                <td style={td}>{x.CHEF_ID}</td>
                <td style={td}>
                  {x.activo ? (
                    <span style={{ color: "#059669", fontWeight: "bold" }}>✓ Activo</span>
                  ) : (
                    <span style={{ color: "#6b7280" }}>Inactivo</span>
                  )}
                </td>
                <td style={td}>
                  <button onClick={() => { setEditId(x.ID_Menu); setForm({ fecha: x.fecha?.slice(0,10), CHEF_ID: x.CHEF_ID, activo: x.activo === 1 || x.activo === true }); }} style={btnPrimary}>Editar</button>
                  {!x.activo && (
                    <button onClick={() => activarMenu(x.ID_Menu)} style={{ ...btnPrimary, background: "#059669" }}>Activar</button>
                  )}
                  <button onClick={() => remove(x.ID_Menu)} style={{ ...btnPrimary, background: "#f43f5e" }}>Borrar</button>
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
const btnPrimary = { padding: "8px 12px", borderRadius: 8, border: 0, background: "#111827", color: "white", cursor: "pointer", marginRight: "4px" };
const btnGhost = { padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db", background: "white", cursor: "pointer" };

export default Menus;
