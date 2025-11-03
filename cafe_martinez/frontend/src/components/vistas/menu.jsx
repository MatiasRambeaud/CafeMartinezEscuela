import React, { useState } from "react";
import Nav from "../common/Nav";

const Menu = () => {
  const productos = [
    { id: 1, nombre: "Espresso", img: "/img/espresso.png", precio: 1500 },
    { id: 2, nombre: "Cappuccino", img: "/img/cappuccino.jpg", precio: 2200 },
    { id: 3, nombre: "Latte", img: "/img/latte.png", precio: 2300 },
    { id: 4, nombre: "Cold Brew", img: "/img/coldbrew.png", precio: 2600 },
    { id: 5, nombre: "Medialuna", img: "/img/medialunas.png", precio: 1200 },
    { id: 6, nombre: "Chocotorta (porción)", img: "/img/chocotorta.png", precio: 3000 },
    { id: 7, nombre: "Cheesecake (porción)", img: "/img/cheesecake.png", precio: 3200 },
  ];

  const [cantidades, setCantidades] = useState({});
  const [carrito, setCarrito] = useState({}); // { id: { producto, cantidad } }

  const setCantidad = (id, value) => {
    const n = Math.max(1, Number(value) || 1);
    setCantidades((prev) => ({ ...prev, [id]: n }));
  };

  const agregarAlCarrito = (p) => {
    const q = cantidades[p.id] || 1;
    setCarrito((prev) => {
      const existente = prev[p.id]?.cantidad || 0;
      return {
        ...prev,
        [p.id]: { producto: p, cantidad: existente + q },
      };
    });
    setCantidades((prev) => ({ ...prev, [p.id]: 1 }));
  };

  const actualizarCantidadEnCarrito = (id, nuevaCantidad) => {
    const cantidad = Math.max(1, Number(nuevaCantidad) || 1);
    setCarrito((prev) => {
      if (!prev[id]) return prev;
      return { ...prev, [id]: { ...prev[id], cantidad } };
    });
  };

  const quitarDelCarrito = (id) => {
    setCarrito((prev) => {
      const copia = { ...prev };
      delete copia[id];
      return copia;
    });
  };

  const total = Object.values(carrito).reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0);

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", color: "#1f2937" }}>
      <Nav />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 16px" }}>
        <h1 style={{ fontSize: 32, marginTop: 0 }}>Menú</h1>
        <p style={{ fontSize: 16, color: "#4b5563" }}>
          Descubrí nuestras bebidas de especialidad, blends y pastelería artesanal.
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
          marginTop: 16,
        }}>
          {productos.map((p) => (
            <div key={p.id} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
              <div style={{ width: "100%", height: 140, overflow: "hidden", borderRadius: 6, marginBottom: 8 }}>
                <img
                  src={p.img}
                  alt={p.nombre}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              <div style={{ fontWeight: 600 }}>{p.nombre}</div>
              <div style={{ color: "#6b7280", marginBottom: 8 }}>$ {p.precio.toLocaleString("es-AR")}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="number"
                  min={1}
                  value={cantidades[p.id] || 1}
                  onChange={(e) => setCantidad(p.id, e.target.value)}
                  style={{ width: 70, padding: 6, border: "1px solid #d1d5db", borderRadius: 6 }}
                />
                <button
                  onClick={() => agregarAlCarrito(p)}
                  style={{ padding: "6px 10px", background: "#111827", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}
                >
                  Agregar
                </button>
              </div>
            </div>
          ))}
        </div>

        <section style={{ marginTop: 28 }}>
          <h2 style={{ fontSize: 22, marginBottom: 12 }}>Carrito</h2>
          {Object.keys(carrito).length === 0 ? (
            <p style={{ color: "#6b7280" }}>Tu carrito está vacío.</p>
          ) : (
            <div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={th}>Producto</th>
                    <th style={th}>Cantidad</th>
                    <th style={th}>Precio</th>
                    <th style={th}>Subtotal</th>
                    <th style={th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(carrito).map(({ producto, cantidad }) => (
                    <tr key={producto.id}>
                      <td style={td}>{producto.nombre}</td>
                      <td style={td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button
                            onClick={() => actualizarCantidadEnCarrito(producto.id, cantidad - 1)}
                            style={{ padding: "4px 8px", border: "1px solid #d1d5db", background: "white", borderRadius: 6, cursor: "pointer" }}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={cantidad}
                            onChange={(e) => actualizarCantidadEnCarrito(producto.id, e.target.value)}
                            style={{ width: 70, padding: 6, border: "1px solid #d1d5db", borderRadius: 6 }}
                          />
                          <button
                            onClick={() => actualizarCantidadEnCarrito(producto.id, cantidad + 1)}
                            style={{ padding: "4px 8px", border: "1px solid #d1d5db", background: "white", borderRadius: 6, cursor: "pointer" }}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td style={td}>$ {producto.precio.toLocaleString("es-AR")}</td>
                      <td style={td}>$ {(producto.precio * cantidad).toLocaleString("es-AR")}</td>
                      <td style={td}>
                        <button
                          onClick={() => quitarDelCarrito(producto.id)}
                          style={{ padding: "6px 10px", background: "#f43f5e", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}
                        >
                          Quitar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ textAlign: "right", marginTop: 12, fontWeight: 700 }}>
                Total: $ {total.toLocaleString("es-AR")}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const th = { textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: 8 };
const td = { borderBottom: "1px solid #f3f4f6", padding: 8 };

export default Menu;
