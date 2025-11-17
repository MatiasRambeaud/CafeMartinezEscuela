import React, { useEffect, useState } from "react";
import Nav from "../../common/Nav";

const Comidas = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ Nombre: "", Descripcion: "", ID_Menu: "", Precio: "" });
  const [imagen, setImagen] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try { setLoading(true); setError("");
      const res = await fetch("http://localhost:3000/api/comidas");
      if (!res.ok) throw new Error();
      setItems(await res.json());
    } catch (_) { setError("No se pudieron cargar las comidas."); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const onChange = (e) => {
    if (e.target.name === "imagen") {
      const file = e.target.files[0];
      if (file) {
        setImagen(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagenPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const save = async (e) => {
    e.preventDefault();
    try { setLoading(true); setError("");
      const formData = new FormData();
      formData.append("Nombre", form.Nombre);
      formData.append("Descripcion", form.Descripcion);
      formData.append("ID_Menu", form.ID_Menu);
      formData.append("Precio", form.Precio || 0);
      if (imagen) {
        formData.append("imagen", imagen);
      }
      if (editId) {
        formData.append("Imagen", form.Imagen || "");
      }

      const url = editId ? `http://localhost:3000/api/comidas/${editId}` : "http://localhost:3000/api/comidas";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, { method, body: formData });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Error al guardar");
      }
      setForm({ Nombre: "", Descripcion: "", ID_Menu: "", Precio: "" });
      setImagen(null);
      setImagenPreview(null);
      setEditId(null);
      await load();
    } catch (err) { setError(err.message || "No se pudo guardar."); }
    finally { setLoading(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar comida?")) return;
    try { setLoading(true); setError("");
      const res = await fetch(`http://localhost:3000/api/comidas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      await load();
    } catch (_) { setError("No se pudo eliminar."); }
    finally { setLoading(false); }
  };

  const handleEdit = (x) => {
    setEditId(x.ID_Comida);
    setForm({ Nombre: x.Nombre, Descripcion: x.Descripcion, ID_Menu: x.ID_Menu, Precio: x.Precio || "", Imagen: x.Imagen || "" });
    setImagen(null);
    setImagenPreview(x.Imagen ? `http://localhost:3000${x.Imagen}` : null);
  };

  const handleCancel = () => {
    setEditId(null);
    setForm({ Nombre: "", Descripcion: "", ID_Menu: "", Precio: "" });
    setImagen(null);
    setImagenPreview(null);
  };

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", color: "#1f2937" }}>
      <Nav />
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 16px" }}>
        <h1 style={{ fontSize: 28, marginTop: 0 }}>Comidas</h1>
        {error && <div style={{ color: "#b91c1c", marginBottom: 12 }}>{error}</div>}
        {loading && <div style={{ color: "#6b7280", marginBottom: 12 }}>Cargando...</div>}
        <form onSubmit={save} style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 16 }}>
          <input name="Nombre" value={form.Nombre} onChange={onChange} placeholder="Nombre" style={input} required />
          <input name="Descripcion" value={form.Descripcion} onChange={onChange} placeholder="Descripción" style={input} required />
          <input name="ID_Menu" type="number" value={form.ID_Menu} onChange={onChange} placeholder="ID_Menu" style={input} required />
          <input name="Precio" type="number" step="0.01" value={form.Precio} onChange={onChange} placeholder="Precio" style={input} required />
          <div style={{ gridColumn: "1 / -1" }}>
            <input name="imagen" type="file" accept="image/*" onChange={onChange} style={input} />
            {imagenPreview && (
              <img src={imagenPreview} alt="Preview" style={{ maxWidth: "200px", maxHeight: "200px", marginTop: "8px", borderRadius: "8px" }} />
            )}
          </div>
          <button type="submit" style={btnPrimary}>{editId ? "Actualizar" : "Agregar"}</button>
          {editId && <button type="button" onClick={handleCancel} style={btnGhost}>Cancelar</button>}
        </form>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>ID_Comida</th>
              <th style={th}>Imagen</th>
              <th style={th}>Nombre</th>
              <th style={th}>Descripcion</th>
              <th style={th}>ID_Menu</th>
              <th style={th}>Precio</th>
              <th style={th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((x) => (
              <tr key={x.ID_Comida}>
                <td style={td}>{x.ID_Comida}</td>
                <td style={td}>
                  {x.Imagen && (
                    <img src={`http://localhost:3000${x.Imagen}`} alt={x.Nombre} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
                  )}
                </td>
                <td style={td}>{x.Nombre}</td>
                <td style={td}>{x.Descripcion}</td>
                <td style={td}>{x.ID_Menu}</td>
                <td style={td}>${x.Precio || 0}</td>
                <td style={td}>
                  <button onClick={() => handleEdit(x)} style={btnPrimary}>Editar</button>
                  <button onClick={() => remove(x.ID_Comida)} style={{ ...btnPrimary, background: "#f43f5e" }}>Borrar</button>
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

export default Comidas;
