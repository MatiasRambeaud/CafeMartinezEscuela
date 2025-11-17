import React, { useState, useEffect } from "react";
import Nav from "../common/Nav";

const Menu = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cantidades, setCantidades] = useState({});
  const [carrito, setCarrito] = useState({}); // { id: { producto, cantidad } }

  useEffect(() => {
    cargarComidas();
  }, []);

  const cargarComidas = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/comidas/menu-activo");
      if (response.ok) {
        const comidas = await response.json();
        // Transformar las comidas de la BD al formato esperado
        const productosFormateados = comidas.map(comida => ({
          id: comida.ID_Comida,
          nombre: comida.Nombre,
          img: comida.Imagen || "/img/default.png",
          precio: parseFloat(comida.Precio) || 0,
          descripcion: comida.Descripcion
        }));
        setProductos(productosFormateados);
      } else {
        console.error("Error al cargar comidas");
      }
    } catch (error) {
      console.error("Error al cargar comidas:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const realizarPedido = async () => {
    if (Object.keys(carrito).length === 0) {
      alert("Tu carrito está vacío");
      return;
    }

    try {
      // Obtener usuario logueado
      const rawUsuario = localStorage.getItem("usuario");
      if (!rawUsuario) {
        alert("Debes iniciar sesión para realizar un pedido");
        return;
      }
      const usuario = JSON.parse(rawUsuario);

      // Preparar productos del pedido
      const productos = Object.values(carrito).map(({ producto, cantidad }) => ({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: cantidad
      }));

      // Crear el pedido
      const response = await fetch("http://localhost:3000/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ID_Usuario: usuario.ID_Usuario,
          total: total,
          productos: productos
        }),
      });

      if (response.ok) {
        alert("¡Pedido realizado con éxito! El mozo lo atenderá pronto.");
        // Limpiar el carrito
        setCarrito({});
        setCantidades({});
      } else {
        const error = await response.json();
        alert(error.error || "Error al realizar el pedido");
      }
    } catch (error) {
      console.error("Error al realizar pedido:", error);
      alert("Error al realizar el pedido. Intenta nuevamente.");
    }
  };

  return (
    <div style={{ 
      fontFamily: "'Crimson Text', 'Georgia', 'Times New Roman', serif", 
      color: "#3E2723",
      background: "linear-gradient(to bottom, #F5E6D3 0%, #EFEBE9 100%)",
      minHeight: "100vh"
    }}>
      <Nav />
      <main style={{ 
        maxWidth: 1200, 
        margin: "0 auto", 
        padding: "50px 20px",
        background: "#FFFFFF",
        borderRadius: "20px 20px 0 0",
        marginTop: "20px",
        boxShadow: "0 -4px 20px rgba(61,39,35,.1)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "40px", paddingBottom: "30px", borderBottom: "3px solid #D7CCC8" }}>
          <h1 style={{ 
            fontSize: "48px", 
            marginTop: 0, 
            marginBottom: "10px",
            color: "#3E2723",
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontWeight: 700,
            letterSpacing: "1px"
          }}>
            Nuestro Menú
          </h1>
          <p style={{ 
            fontSize: "20px", 
            color: "#8D6E63",
            fontStyle: "italic",
            marginTop: "10px"
          }}>
            Descubrí nuestras bebidas de especialidad, blends y pastelería artesanal
          </p>
        </div>
        
        {loading ? (
          <div style={{ 
            textAlign: "center", 
            padding: "60px", 
            color: "#8D6E63",
            fontSize: "20px"
          }}>
            Cargando menú...
          </div>
        ) : productos.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "60px", 
            color: "#8D6E63",
            fontSize: "20px"
          }}>
            No hay productos disponibles en el menú actual.
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "24px",
            marginTop: "30px",
          }}>
            {productos.map((p) => (
            <div key={p.id} style={{ 
              border: "2px solid #D7CCC8", 
              borderRadius: "16px", 
              padding: "16px",
              background: "#FFFFFF",
              boxShadow: "0 4px 12px rgba(61,39,35,.08)",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(61,39,35,.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(61,39,35,.08)";
            }}
            >
              <div style={{ 
                width: "100%", 
                height: "180px", 
                overflow: "hidden", 
                borderRadius: "12px", 
                marginBottom: "12px",
                background: "#F5E6D3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px"
              }}>
                <img
                  src={p.img.startsWith("/") ? `http://localhost:3000${p.img}` : p.img}
                  alt={p.nombre}
                  style={{ 
                    maxWidth: "100%", 
                    maxHeight: "100%", 
                    objectFit: "contain", 
                    display: "block",
                    borderRadius: "8px"
                  }}
                  onError={(e) => {
                    e.target.src = "/img/default.png";
                  }}
                />
              </div>
              <div style={{ 
                fontWeight: 600, 
                fontSize: "20px",
                color: "#3E2723",
                marginBottom: "8px",
                fontFamily: "'Playfair Display', serif"
              }}>
                {p.nombre}
              </div>
              <div style={{ 
                color: "#8D6E63", 
                marginBottom: "12px",
                fontSize: "18px",
                fontWeight: 500
              }}>
                $ {p.precio.toLocaleString("es-AR")}
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="number"
                  min={1}
                  value={cantidades[p.id] || 1}
                  onChange={(e) => setCantidad(p.id, e.target.value)}
                  style={{ 
                    width: "70px", 
                    padding: "8px", 
                    border: "2px solid #D7CCC8", 
                    borderRadius: "8px",
                    fontSize: "16px",
                    color: "#3E2723",
                    background: "#F5E6D3"
                  }}
                />
                <button
                  onClick={() => agregarAlCarrito(p)}
                  style={{ 
                    padding: "8px 16px", 
                    background: "#5D4037", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "8px", 
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: 600,
                    flex: 1,
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#3E2723"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#5D4037"}
                >
                  Agregar
                </button>
              </div>
            </div>
            ))}
          </div>
        )}

        <section style={{ 
          marginTop: "50px",
          padding: "30px",
          background: "#F5E6D3",
          borderRadius: "16px",
          border: "2px solid #D7CCC8"
        }}>
          <h2 style={{ 
            fontSize: "32px", 
            marginBottom: "20px",
            color: "#3E2723",
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700
          }}>
            Tu Carrito
          </h2>
          {Object.keys(carrito).length === 0 ? (
            <p style={{ 
              color: "#8D6E63", 
              fontSize: "18px",
              fontStyle: "italic",
              textAlign: "center",
              padding: "40px"
            }}>
              Tu carrito está vacío. ¡Agregá productos para comenzar!
            </p>
          ) : (
            <div>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "#FFFFFF", borderRadius: "12px", overflow: "hidden" }}>
                <thead>
                  <tr style={{ background: "#5D4037", color: "white" }}>
                    <th style={th}>Producto</th>
                    <th style={th}>Cantidad</th>
                    <th style={th}>Precio</th>
                    <th style={th}>Subtotal</th>
                    <th style={th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(carrito).map(({ producto, cantidad }) => (
                    <tr key={producto.id} style={{ background: "#FFFFFF" }}>
                      <td style={td}>{producto.nombre}</td>
                      <td style={td}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
                          <button
                            onClick={() => actualizarCantidadEnCarrito(producto.id, cantidad - 1)}
                            style={{ 
                              padding: "6px 12px", 
                              border: "2px solid #D7CCC8", 
                              background: "#F5E6D3", 
                              borderRadius: "8px", 
                              cursor: "pointer",
                              fontSize: "18px",
                              fontWeight: 600,
                              color: "#3E2723",
                              transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#D7CCC8";
                              e.currentTarget.style.borderColor = "#8D6E63";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#F5E6D3";
                              e.currentTarget.style.borderColor = "#D7CCC8";
                            }}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={cantidad}
                            onChange={(e) => actualizarCantidadEnCarrito(producto.id, e.target.value)}
                            style={{ 
                              width: "80px", 
                              padding: "8px", 
                              border: "2px solid #D7CCC8", 
                              borderRadius: "8px",
                              textAlign: "center",
                              fontSize: "16px",
                              color: "#3E2723",
                              background: "#FFFFFF"
                            }}
                          />
                          <button
                            onClick={() => actualizarCantidadEnCarrito(producto.id, cantidad + 1)}
                            style={{ 
                              padding: "6px 12px", 
                              border: "2px solid #D7CCC8", 
                              background: "#F5E6D3", 
                              borderRadius: "8px", 
                              cursor: "pointer",
                              fontSize: "18px",
                              fontWeight: 600,
                              color: "#3E2723",
                              transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#D7CCC8";
                              e.currentTarget.style.borderColor = "#8D6E63";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#F5E6D3";
                              e.currentTarget.style.borderColor = "#D7CCC8";
                            }}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td style={td}>$ {producto.precio.toLocaleString("es-AR")}</td>
                      <td style={{ ...td, fontWeight: 600 }}>$ {(producto.precio * cantidad).toLocaleString("es-AR")}</td>
                      <td style={td}>
                        <button
                          onClick={() => quitarDelCarrito(producto.id)}
                          style={{ 
                            padding: "8px 16px", 
                            background: "#A1887F", 
                            color: "white", 
                            border: "none", 
                            borderRadius: "8px", 
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: 600,
                            transition: "background 0.2s"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#8D6E63"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "#A1887F"}
                        >
                          Quitar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ 
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "24px",
                padding: "20px",
                background: "#FFFFFF",
                borderRadius: "12px",
                border: "2px solid #D7CCC8"
              }}>
                <div style={{ 
                  fontWeight: 700,
                  fontSize: "24px",
                  color: "#3E2723"
                }}>
                  Total: $ {total.toLocaleString("es-AR")}
                </div>
                <button
                  onClick={realizarPedido}
                  style={{
                    padding: "14px 28px",
                    background: "#5D4037",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "18px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Playfair Display', serif",
                    transition: "background 0.2s",
                    boxShadow: "0 4px 12px rgba(61,39,35,.2)"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#3E2723"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#5D4037"}
                >
                  Realizar Pedido
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const th = { 
  textAlign: "left", 
  borderBottom: "2px solid #D7CCC8", 
  padding: "16px",
  fontSize: "18px",
  fontWeight: 600,
  fontFamily: "'Playfair Display', serif"
};
const td = { 
  borderBottom: "1px solid #EFEBE9", 
  padding: "16px",
  fontSize: "16px",
  color: "#3E2723"
};

export default Menu;
