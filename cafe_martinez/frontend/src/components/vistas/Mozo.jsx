import React, { useState, useEffect } from "react";
import Nav from "../common/Nav";

const Mozo = () => {
  const [pedidos, setPedidos] = useState([]);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("usuario");
    if (raw) {
      setUsuario(JSON.parse(raw));
    }
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/pedidos");
      if (response.ok) {
        const data = await response.json();
        setPedidos(data);
      }
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    }
  };

  const marcarEstado = async (pedidoId, estado) => {
    try {
      const response = await fetch(`http://localhost:3000/api/pedidos/${pedidoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });
      if (response.ok) {
        cargarPedidos();
        alert(`Pedido ${estado === "completado" ? "marcado como completado" : "marcado como pendiente"}`);
      }
    } catch (error) {
      console.error("Error al actualizar pedido:", error);
      alert("Error al actualizar el pedido");
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
            Panel de Mozo
          </h1>
          <p style={{ 
            fontSize: "20px", 
            color: "#8D6E63",
            fontStyle: "italic",
            marginTop: "10px"
          }}>
            Gestión de Pedidos
          </p>
        </div>

        <div style={{ marginTop: "30px" }}>
          {pedidos.length === 0 ? (
            <p style={{ 
              color: "#8D6E63", 
              fontSize: "18px",
              fontStyle: "italic",
              textAlign: "center",
              padding: "40px"
            }}>
              No hay pedidos pendientes
            </p>
          ) : (
            <div style={{ display: "grid", gap: "20px" }}>
              {pedidos.map((pedido, index) => (
                <div
                  key={pedido.ID_Pedido || index}
                  style={{
                    border: "2px solid #D7CCC8",
                    borderRadius: "16px",
                    padding: "24px",
                    background: pedido.estado === "completado" ? "#F5E6D3" : "#FFFFFF",
                    boxShadow: "0 4px 12px rgba(61,39,35,.08)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <div>
                      <h3 style={{ 
                        fontSize: "24px", 
                        color: "#3E2723",
                        fontFamily: "'Playfair Display', serif",
                        margin: "0 0 8px 0"
                      }}>
                        Pedido #{pedido.ID_Pedido || index + 1}
                      </h3>
                      <p style={{ color: "#8D6E63", margin: "4px 0", fontSize: "16px" }}>
                        <strong>Cliente:</strong> {pedido.cliente_nombre || "N/A"}
                      </p>
                      <p style={{ color: "#8D6E63", margin: "4px 0", fontSize: "16px" }}>
                        <strong>Fecha:</strong> {new Date(pedido.fecha || Date.now()).toLocaleString("es-AR")}
                      </p>
                    </div>
                    <div style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      background: pedido.estado === "completado" ? "#5D4037" : "#A1887F",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "14px"
                    }}>
                      {pedido.estado === "completado" ? "Completado" : "Pendiente"}
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <h4 style={{ color: "#3E2723", marginBottom: "12px", fontSize: "18px" }}>Productos:</h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {pedido.productos && pedido.productos.length > 0 ? (
                        pedido.productos.map((prod, idx) => (
                          <li key={idx} style={{ 
                            padding: "8px 0", 
                            borderBottom: "1px solid #EFEBE9",
                            color: "#5D4037"
                          }}>
                            {prod.nombre} x{prod.cantidad} - ${prod.precio ? (prod.precio * prod.cantidad).toLocaleString("es-AR") : "0"}
                          </li>
                        ))
                      ) : (
                        <li style={{ color: "#8D6E63", fontStyle: "italic" }}>Sin productos</li>
                      )}
                    </ul>
                  </div>

                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    paddingTop: "16px",
                    borderTop: "2px solid #D7CCC8"
                  }}>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: "#3E2723" }}>
                      Total: ${pedido.total ? pedido.total.toLocaleString("es-AR") : "0"}
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button
                        onClick={() => marcarEstado(pedido.ID_Pedido || index, "pendiente")}
                        style={{
                          padding: "10px 20px",
                          background: pedido.estado === "pendiente" ? "#5D4037" : "#D7CCC8",
                          color: pedido.estado === "pendiente" ? "white" : "#3E2723",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: 600,
                          transition: "background 0.2s"
                        }}
                        disabled={pedido.estado === "pendiente"}
                      >
                        Pendiente
                      </button>
                      <button
                        onClick={() => marcarEstado(pedido.ID_Pedido || index, "completado")}
                        style={{
                          padding: "10px 20px",
                          background: pedido.estado === "completado" ? "#5D4037" : "#8D6E63",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: 600,
                          transition: "background 0.2s"
                        }}
                        disabled={pedido.estado === "completado"}
                      >
                        Completado
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Mozo;

