import React, { useState, useEffect } from "react";
import Nav from "../common/Nav";

const Recepcionista = () => {
  const [pedidos, setPedidos] = useState([]);
  const [totalRecaudado, setTotalRecaudado] = useState(0);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [datosTarjeta, setDatosTarjeta] = useState({
    numero: "",
    titular: "",
    vencimiento: "",
    cvv: ""
  });

  useEffect(() => {
    cargarPedidos();
    calcularTotalRecaudado();
  }, []);

  const cargarPedidos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/pedidos/completados");
      if (response.ok) {
        const data = await response.json();
        setPedidos(data);
        calcularTotalRecaudado(data);
      }
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    }
  };

  const calcularTotalRecaudado = (pedidosData = pedidos) => {
    const total = pedidosData
      .filter(p => p.estado_cobro === "cobrado")
      .reduce((sum, p) => sum + (parseFloat(p.total) || 0), 0);
    setTotalRecaudado(total);
  };

  const abrirModalPago = (pedido) => {
    setPedidoSeleccionado(pedido);
    setMetodoPago("efectivo");
    setDatosTarjeta({ numero: "", titular: "", vencimiento: "", cvv: "" });
    setMostrarModalPago(true);
  };

  const cerrarModalPago = () => {
    setMostrarModalPago(false);
    setPedidoSeleccionado(null);
    setMetodoPago("efectivo");
    setDatosTarjeta({ numero: "", titular: "", vencimiento: "", cvv: "" });
  };

  const marcarCobro = async () => {
    if (!pedidoSeleccionado) return;

    // Validar datos de tarjeta si es necesario
    if (metodoPago === "tarjeta") {
      if (!datosTarjeta.numero || !datosTarjeta.titular || !datosTarjeta.vencimiento || !datosTarjeta.cvv) {
        alert("Por favor, complete todos los datos de la tarjeta");
        return;
      }
      // Validar formato de número de tarjeta (16 dígitos)
      if (datosTarjeta.numero.replace(/\s/g, "").length < 16) {
        alert("El número de tarjeta debe tener 16 dígitos");
        return;
      }
      // Validar formato de fecha (MM/YY)
      if (!/^\d{2}\/\d{2}$/.test(datosTarjeta.vencimiento)) {
        alert("La fecha de vencimiento debe tener el formato MM/YY");
        return;
      }
      // Validar CVV (3 o 4 dígitos)
      if (datosTarjeta.cvv.length < 3 || datosTarjeta.cvv.length > 4) {
        alert("El CVV debe tener 3 o 4 dígitos");
        return;
      }
    }

    try {
      const response = await fetch(`http://localhost:3000/api/pedidos/${pedidoSeleccionado.ID_Pedido}/cobro`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado_cobro: "cobrado",
          metodo_pago: metodoPago,
          datos_tarjeta: metodoPago === "tarjeta" ? datosTarjeta : null
        }),
      });
      if (response.ok) {
        alert(`Pedido marcado como cobrado (${metodoPago === "efectivo" ? "Efectivo" : "Tarjeta"})`);
        cerrarModalPago();
        cargarPedidos();
      } else {
        const error = await response.json();
        alert(error.error || "Error al actualizar el cobro");
      }
    } catch (error) {
      console.error("Error al actualizar cobro:", error);
      alert("Error al actualizar el cobro");
    }
  };

  const marcarPendiente = async (pedidoId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/pedidos/${pedidoId}/cobro`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado_cobro: "pendiente" }),
      });
      if (response.ok) {
        cargarPedidos();
        alert("Pedido marcado como pendiente");
      }
    } catch (error) {
      console.error("Error al actualizar cobro:", error);
      alert("Error al actualizar el cobro");
    }
  };


  const formatearNumeroTarjeta = (value) => {
    // Remover espacios y solo permitir números
    const numero = value.replace(/\s/g, "").replace(/\D/g, "");
    // Agregar espacios cada 4 dígitos
    return numero.match(/.{1,4}/g)?.join(" ") || numero;
  };

  const formatearFechaVencimiento = (value) => {
    // Remover todo excepto números
    const numero = value.replace(/\D/g, "");
    // Formato MM/YY
    if (numero.length <= 2) return numero;
    return numero.slice(0, 2) + "/" + numero.slice(2, 4);
  };

  const pedidosCobrados = pedidos.filter(p => p.estado_cobro === "cobrado");
  const pedidosPendientes = pedidos.filter(p => p.estado_cobro === "pendiente");

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
            Panel de Recepcionista
          </h1>
          <p style={{ 
            fontSize: "20px", 
            color: "#8D6E63",
            fontStyle: "italic",
            marginTop: "10px"
          }}>
            Gestión de Cobros
          </p>
        </div>

        <div style={{
          background: "#5D4037",
          color: "white",
          padding: "30px",
          borderRadius: "16px",
          marginBottom: "40px",
          textAlign: "center"
        }}>
          <h2 style={{ 
            fontSize: "24px", 
            margin: "0 0 10px 0",
            fontFamily: "'Playfair Display', serif"
          }}>
            Total Recaudado del Día
          </h2>
          <p style={{ 
            fontSize: "48px", 
            margin: 0,
            fontWeight: 700
          }}>
            ${totalRecaudado.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div style={{ marginTop: "30px" }}>
          <h2 style={{ 
            fontSize: "32px", 
            color: "#3E2723",
            fontFamily: "'Playfair Display', serif",
            marginBottom: "20px"
          }}>
            Pedidos Pendientes de Cobro
          </h2>
          {pedidosPendientes.length === 0 ? (
            <p style={{ 
              color: "#8D6E63", 
              fontSize: "18px",
              fontStyle: "italic",
              textAlign: "center",
              padding: "40px"
            }}>
              No hay pedidos pendientes de cobro
            </p>
          ) : (
            <div style={{ display: "grid", gap: "20px", marginBottom: "40px" }}>
              {pedidosPendientes.map((pedido, index) => (
                <div
                  key={pedido.ID_Pedido || index}
                  style={{
                    border: "3px solid #A1887F",
                    borderRadius: "16px",
                    padding: "24px",
                    background: "#FFF3E0",
                    boxShadow: "0 4px 12px rgba(61,39,35,.15)"
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
                        <strong>Cliente:</strong> {pedido.cliente_nombre || "N/A"} {pedido.cliente_apellido || ""}
                      </p>
                      <p style={{ color: "#8D6E63", margin: "4px 0", fontSize: "16px" }}>
                        <strong>Fecha:</strong> {new Date(pedido.fecha || Date.now()).toLocaleString("es-AR")}
                      </p>
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
                            {prod.Nombre_Producto || prod.nombre} x{prod.Cantidad || prod.cantidad} - ${((prod.Precio || prod.precio) * (prod.Cantidad || prod.cantidad)).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                      Total: ${pedido.total ? parseFloat(pedido.total).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button
                        onClick={() => abrirModalPago(pedido)}
                        style={{
                          padding: "10px 20px",
                          background: "#5D4037",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: 600,
                          transition: "background 0.2s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#3E2723"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#5D4037"}
                      >
                        Cobrar Pedido
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h2 style={{ 
            fontSize: "32px", 
            color: "#3E2723",
            fontFamily: "'Playfair Display', serif",
            marginTop: "40px",
            marginBottom: "20px"
          }}>
            Pedidos Cobrados
          </h2>
          {pedidosCobrados.length === 0 ? (
            <p style={{ 
              color: "#8D6E63", 
              fontSize: "18px",
              fontStyle: "italic",
              textAlign: "center",
              padding: "40px"
            }}>
              No hay pedidos cobrados aún
            </p>
          ) : (
            <div style={{ display: "grid", gap: "20px" }}>
              {pedidosCobrados.map((pedido, index) => (
                <div
                  key={pedido.ID_Pedido || index}
                  style={{
                    border: "2px solid #D7CCC8",
                    borderRadius: "16px",
                    padding: "24px",
                    background: "#F5E6D3",
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
                        <strong>Cliente:</strong> {pedido.cliente_nombre || "N/A"} {pedido.cliente_apellido || ""}
                      </p>
                      <p style={{ color: "#8D6E63", margin: "4px 0", fontSize: "16px" }}>
                        <strong>Fecha:</strong> {new Date(pedido.fecha || Date.now()).toLocaleString("es-AR")}
                      </p>
                    </div>
                    <div style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      background: "#5D4037",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "14px"
                    }}>
                      Cobrado
                    </div>
                  </div>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: "#3E2723" }}>
                    Total: ${pedido.total ? parseFloat(pedido.total).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
                  </div>
                  <button
                    onClick={() => marcarPendiente(pedido.ID_Pedido || index)}
                    style={{
                      marginTop: "12px",
                      padding: "8px 16px",
                      background: "#A1887F",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "14px"
                    }}
                  >
                    Marcar como Pendiente
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal de Pago */}
      {mostrarModalPago && pedidoSeleccionado && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            padding: "40px",
            maxWidth: "500px",
            width: "90%",
            maxHeight: "90vh",
            overflow: "auto",
            boxShadow: "0 8px 32px rgba(61,39,35,.3)"
          }}>
            <h2 style={{
              fontSize: "28px",
              marginTop: 0,
              marginBottom: "20px",
              color: "#3E2723",
              fontFamily: "'Playfair Display', serif"
            }}>
              Cobrar Pedido #{pedidoSeleccionado.ID_Pedido}
            </h2>
            <p style={{ fontSize: "18px", marginBottom: "20px", color: "#8D6E63" }}>
              Total: <strong>${parseFloat(pedidoSeleccionado.total || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            </p>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "10px", fontSize: "16px", color: "#3E2723", fontWeight: 600 }}>
                Método de Pago:
              </label>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => setMetodoPago("efectivo")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    border: metodoPago === "efectivo" ? "3px solid #5D4037" : "2px solid #D7CCC8",
                    borderRadius: "8px",
                    background: metodoPago === "efectivo" ? "#F5E6D3" : "#FFFFFF",
                    color: "#3E2723",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "16px"
                  }}
                >
                  Efectivo
                </button>
                <button
                  onClick={() => setMetodoPago("tarjeta")}
                  style={{
                    flex: 1,
                    padding: "12px",
                    border: metodoPago === "tarjeta" ? "3px solid #5D4037" : "2px solid #D7CCC8",
                    borderRadius: "8px",
                    background: metodoPago === "tarjeta" ? "#F5E6D3" : "#FFFFFF",
                    color: "#3E2723",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "16px"
                  }}
                >
                  Tarjeta
                </button>
              </div>
            </div>

            {metodoPago === "tarjeta" && (
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#3E2723", fontWeight: 600 }}>
                  Número de Tarjeta:
                </label>
                <input
                  type="text"
                  maxLength={19}
                  placeholder="1234 5678 9012 3456"
                  value={datosTarjeta.numero}
                  onChange={(e) => setDatosTarjeta({ ...datosTarjeta, numero: formatearNumeroTarjeta(e.target.value) })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #D7CCC8",
                    borderRadius: "8px",
                    fontSize: "16px",
                    color: "#3E2723"
                  }}
                />

                <label style={{ display: "block", marginBottom: "8px", marginTop: "16px", fontSize: "14px", color: "#3E2723", fontWeight: 600 }}>
                  Nombre del Titular:
                </label>
                <input
                  type="text"
                  placeholder="JUAN PEREZ"
                  value={datosTarjeta.titular}
                  onChange={(e) => setDatosTarjeta({ ...datosTarjeta, titular: e.target.value.toUpperCase() })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #D7CCC8",
                    borderRadius: "8px",
                    fontSize: "16px",
                    color: "#3E2723"
                  }}
                />

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px", marginTop: "16px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#3E2723", fontWeight: 600 }}>
                      Vencimiento (MM/YY):
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="12/25"
                      value={datosTarjeta.vencimiento}
                      onChange={(e) => setDatosTarjeta({ ...datosTarjeta, vencimiento: formatearFechaVencimiento(e.target.value) })}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #D7CCC8",
                        borderRadius: "8px",
                        fontSize: "16px",
                        color: "#3E2723"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#3E2723", fontWeight: 600 }}>
                      CVV:
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="123"
                      value={datosTarjeta.cvv}
                      onChange={(e) => setDatosTarjeta({ ...datosTarjeta, cvv: e.target.value.replace(/\D/g, "") })}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #D7CCC8",
                        borderRadius: "8px",
                        fontSize: "16px",
                        color: "#3E2723"
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", marginTop: "30px" }}>
              <button
                onClick={cerrarModalPago}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "2px solid #D7CCC8",
                  borderRadius: "8px",
                  background: "#FFFFFF",
                  color: "#3E2723",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "16px"
                }}
              >
                Cancelar
              </button>
              <button
                onClick={marcarCobro}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#5D4037",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "16px"
                }}
              >
                Confirmar Cobro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recepcionista;
