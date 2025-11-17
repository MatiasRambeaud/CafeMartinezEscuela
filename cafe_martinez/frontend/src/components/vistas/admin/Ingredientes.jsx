import React, { useEffect, useState } from "react";
import Nav from "../../common/Nav";

const Ingredientes = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ Nombre: "", Descripcion: "", ID_Almacen: "", Stock: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notificaciones, setNotificaciones] = useState([]);

  const load = async () => {
    try { setLoading(true); setError("");
      const res = await fetch("http://localhost:3000/api/ingredientes");
      if (!res.ok) throw new Error();
      setItems(await res.json());
    } catch (_) { setError("No se pudieron cargar los ingredientes."); }
    finally { setLoading(false); }
  };

  const cargarNotificaciones = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/ingredientes/stock-bajo");
      if (res.ok) {
        const data = await res.json();
        setNotificaciones(data);
      }
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    }
  };

  useEffect(() => { 
    load(); 
    cargarNotificaciones();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    try { setLoading(true); setError("");
      const url = editId ? `http://localhost:3000/api/ingredientes/${editId}` : "http://localhost:3000/api/ingredientes";
      const method = editId ? "PUT" : "POST";
      const payload = { 
        ...form, 
        ID_Almacen: Number(form.ID_Almacen),
        Stock: form.Stock ? Number(form.Stock) : 0
      };
      if (!payload.Nombre?.trim() || !payload.Descripcion?.trim()) throw new Error("Completa Nombre y Descripción");
      if (!Number.isFinite(payload.ID_Almacen) || payload.ID_Almacen <= 0) throw new Error("ID_Almacen inválido");
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) {
        let msg = "Error al guardar.";
        try { const data = await res.json(); if (data?.error) msg = data.error; } catch (_) {}
        throw new Error(msg);
      }
      setForm({ Nombre: "", Descripcion: "", ID_Almacen: "", Stock: "" });
      setEditId(null);
      await load();
      await cargarNotificaciones();
    } catch (err) { setError(err.message || "No se pudo guardar."); }
    finally { setLoading(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar ingrediente?")) return;
    try { setLoading(true); setError("");
      const res = await fetch(`http://localhost:3000/api/ingredientes/${id}`, { method: "DELETE" });
      if (!res.ok) {
        let msg = "No se pudo eliminar.";
        try { const data = await res.json(); if (data?.error) msg = data.error; } catch (_) {}
        throw new Error(msg);
      }
      await load();
      await cargarNotificaciones();
    } catch (err) { setError(err.message || "No se pudo eliminar."); }
    finally { setLoading(false); }
  };


  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", color: "#1f2937" }}>
      <Nav />
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 16px" }}>
        <h1 style={{ fontSize: 28, marginTop: 0 }}>Ingredientes</h1>
        {error && <div style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</div>}
        {loading && <div style={{ color: "#6b7280", marginBottom: 12 }}>Cargando...</div>}
        
        {notificaciones.length > 0 && (
          <div style={{
            background: "#FEF3C7",
            border: "2px solid #F59E0B",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "24px"
          }}>
            <h2 style={{ 
              fontSize: "20px", 
              margin: "0 0 12px 0",
              color: "#92400E",
              fontWeight: 600
            }}>
              ⚠️ Alertas del Chef - Stock Bajo
            </h2>
            <div style={{ display: "grid", gap: "12px" }}>
              {notificaciones.map((ingrediente) => (
                <div
                  key={ingrediente.ID_Ingrediente}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #F59E0B",
                    borderRadius: "8px",
                    padding: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <strong style={{ color: "#92400E", fontSize: "16px" }}>
                      {ingrediente.Nombre}
                    </strong>
                    <p style={{ color: "#78350F", margin: "4px 0", fontSize: "14px" }}>
                      Stock actual: {parseInt(ingrediente.Stock || 0)} unidades
                    </p>
                    <p style={{ color: "#92400E", margin: "4px 0", fontSize: "12px" }}>
                      {ingrediente.Descripcion}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button
                      onClick={() => {
                        setEditId(ingrediente.ID_Ingrediente);
                        setForm({
                          Nombre: ingrediente.Nombre,
                          Descripcion: ingrediente.Descripcion,
                          ID_Almacen: ingrediente.ID_Almacen,
                          Stock: ingrediente.Stock || 0
                        });
                      }}
                      style={{
                        padding: "8px 16px",
                        background: "#F59E0B",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "14px"
                      }}
                    >
                      Actualizar Stock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <form onSubmit={save} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
          <input name="Nombre" value={form.Nombre} onChange={onChange} placeholder="Nombre" style={input} />
          <input name="Descripcion" value={form.Descripcion} onChange={onChange} placeholder="Descripción" style={input} />
          <input name="ID_Almacen" value={form.ID_Almacen} onChange={onChange} placeholder="ID_Almacen" type="number" style={input} />
          <input name="Stock" value={form.Stock} onChange={onChange} placeholder="Stock" type="number" min="0" style={input} />
          <button type="submit" style={btnPrimary}>{editId ? "Actualizar" : "Agregar"}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ Nombre: "", Descripcion: "", ID_Almacen: "", Stock: "" }); }} style={btnGhost}>Cancelar</button>}
        </form>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>ID_Ingrediente</th>
              <th style={th}>Nombre</th>
              <th style={th}>Descripcion</th>
              <th style={th}>ID_Almacen</th>
              <th style={th}>Stock</th>
              <th style={th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((x) => (
              <tr key={x.ID_Ingrediente}>
                <td style={td}>{x.ID_Ingrediente}</td>
                <td style={td}>{x.Nombre}</td>
                <td style={td}>{x.Descripcion}</td>
                <td style={td}>{x.ID_Almacen}</td>
                <td style={td}>
                  <input
                    type="number"
                    min="0"
                    defaultValue={x.Stock || 0}
                    onBlur={async (e) => {
                      const nuevoStock = parseInt(e.target.value) || 0;
                      if (nuevoStock !== (x.Stock || 0)) {
                        try {
                          const res = await fetch(`http://localhost:3000/api/ingredientes/${x.ID_Ingrediente}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ Stock: nuevoStock }),
                          });
                          if (res.ok) {
                            await load();
                            await cargarNotificaciones();
                          }
                        } catch (err) {
                          console.error("Error al actualizar stock:", err);
                        }
                      }
                    }}
                    style={{ ...input, width: "80px", textAlign: "center" }}
                  />
                </td>
                <td style={td}>
                  <button onClick={() => { setEditId(x.ID_Ingrediente); setForm({ Nombre: x.Nombre, Descripcion: x.Descripcion, ID_Almacen: x.ID_Almacen, Stock: x.Stock || 0 }); }} style={btnPrimary}>Editar</button>
                  <button onClick={() => remove(x.ID_Ingrediente)} style={{ ...btnPrimary, background: "#f43f5e" }}>Borrar</button>
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

export default Ingredientes;


