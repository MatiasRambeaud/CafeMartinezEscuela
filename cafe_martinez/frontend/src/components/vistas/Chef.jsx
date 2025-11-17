import React, { useState, useEffect } from "react";
import Nav from "../common/Nav";

const Chef = () => {
  const [ingredientes, setIngredientes] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [stockInputs, setStockInputs] = useState({});
  const [pedidosCompletados, setPedidosCompletados] = useState([]);
  const [pedidosVistos, setPedidosVistos] = useState(new Set());

  useEffect(() => {
    cargarIngredientes();
    cargarPedidosCompletados();
  }, []);

  const cargarIngredientes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/ingredientes");
      if (response.ok) {
        const data = await response.json();
        setIngredientes(data);
        verificarStockBajo(data);
        // Inicializar los valores de los inputs con el stock actual
        const inputs = {};
        data.forEach(ing => {
          inputs[ing.ID_Ingrediente] = ing.Stock || 0;
        });
        setStockInputs(inputs);
      }
    } catch (error) {
      console.error("Error al cargar ingredientes:", error);
    }
  };

  const verificarStockBajo = (ingredientesData) => {
    const bajos = ingredientesData.filter(ing => {
      const stock = parseInt(ing.Stock || ing.stock || 0);
      return stock <= 10; // Considerar stock bajo si es 10 o menos
    });
    setAlertas(bajos);
  };

  const actualizarStock = async (ingredienteId, nuevoStock, stockActual) => {
    // El chef solo puede reducir stock, no aumentarlo
    if (nuevoStock > stockActual) {
      alert("Solo puedes reducir el stock. Para agregar stock, contacta al administrador.");
      return;
    }

    if (nuevoStock < 0) {
      alert("El stock no puede ser negativo");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/ingredientes/${ingredienteId}/reducir-stock`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Stock: nuevoStock }),
      });
      if (response.ok) {
        await cargarIngredientes();
        alert("Stock reducido correctamente");
      } else {
        const error = await response.json();
        alert(error.error || "Error al actualizar el stock");
        // Recargar para restaurar el valor correcto
        await cargarIngredientes();
      }
    } catch (error) {
      console.error("Error al actualizar stock:", error);
      alert("Error al actualizar el stock");
    }
  };


  const cargarPedidosCompletados = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/pedidos/completados-chef");
      if (response.ok) {
        const data = await response.json();
        setPedidosCompletados(data);
      }
    } catch (error) {
      console.error("Error al cargar pedidos completados:", error);
    }
  };

  const avisarAdmin = async (ingredienteId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/ingredientes/${ingredienteId}/avisar-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        alert("Se ha avisado al administrador sobre el stock bajo");
      }
    } catch (error) {
      console.error("Error al avisar admin:", error);
      alert("Error al avisar al administrador");
    }
  };

  const marcarPedidoComoVisto = (pedidoId) => {
    setPedidosVistos(prev => new Set([...prev, pedidoId]));
  };

  const pedidosFiltrados = pedidosCompletados.filter(pedido => 
    !pedidosVistos.has(pedido.ID_Pedido)
  );

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
            Panel de Chef
          </h1>
          <p style={{ 
            fontSize: "20px", 
            color: "#8D6E63",
            fontStyle: "italic",
            marginTop: "10px"
          }}>
            Control de Stock
          </p>
        </div>

        {alertas.length > 0 && (
          <div style={{
            background: "#F43F5E",
            color: "white",
            padding: "20px",
            borderRadius: "16px",
            marginBottom: "30px"
          }}>
            <h2 style={{ 
              fontSize: "24px", 
              margin: "0 0 15px 0",
              fontFamily: "'Playfair Display', serif"
            }}>
              ⚠️ Alertas de Stock Bajo
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {alertas.map((alerta, idx) => (
                <li key={idx} style={{ 
                  padding: "8px 0",
                  fontSize: "16px"
                }}>
                  {alerta.Nombre || alerta.nombre}: Stock actual: {alerta.Stock || alerta.stock || 0}
                </li>
              ))}
            </ul>
          </div>
        )}

        {pedidosFiltrados.length > 0 && (
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ 
              fontSize: "32px", 
              color: "#3E2723",
              fontFamily: "'Playfair Display', serif",
              marginBottom: "20px"
            }}>
              Pedidos Completados - Descontar Stock
            </h2>
            <div style={{ display: "grid", gap: "20px" }}>
              {pedidosFiltrados.map((pedido, index) => (
                <div
                  key={pedido.ID_Pedido || index}
                  style={{
                    border: "3px solid #8D6E63",
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
                    <button
                      onClick={() => marcarPedidoComoVisto(pedido.ID_Pedido)}
                      style={{
                        padding: "10px 20px",
                        background: "#059669",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#047857"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#059669"}
                    >
                      ✓ Visto
                    </button>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <h4 style={{ color: "#3E2723", marginBottom: "12px", fontSize: "18px", fontWeight: 600 }}>
                      Productos del Pedido:
                    </h4>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {pedido.productos && pedido.productos.length > 0 ? (
                        pedido.productos.map((prod, idx) => (
                          <li key={idx} style={{ 
                            padding: "12px",
                            marginBottom: "8px",
                            background: "#FFFFFF",
                            borderRadius: "8px",
                            border: "1px solid #D7CCC8"
                          }}>
                            <strong style={{ color: "#3E2723", fontSize: "16px" }}>
                              {prod.nombre || prod.Nombre_Producto || "Producto"}
                            </strong>
                            <p style={{ color: "#8D6E63", margin: "4px 0", fontSize: "14px" }}>
                              Cantidad: {prod.cantidad || prod.Cantidad || 1}
                            </p>
                          </li>
                        ))
                      ) : (
                        <li style={{ color: "#8D6E63", fontStyle: "italic" }}>Sin productos</li>
                      )}
                    </ul>
                  </div>

                  <div style={{
                    padding: "12px",
                    background: "#F5E6D3",
                    borderRadius: "8px",
                    border: "2px solid #8D6E63",
                    marginTop: "16px"
                  }}>
                    <p style={{ color: "#3E2723", fontSize: "14px", margin: 0, fontStyle: "italic" }}>
                      💡 <strong>Nota:</strong> Revisa los productos de este pedido y descuenta los ingredientes correspondientes del stock usando la sección de inventario abajo.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: "30px" }}>
          <h2 style={{ 
            fontSize: "32px", 
            color: "#3E2723",
            fontFamily: "'Playfair Display', serif",
            marginBottom: "20px"
          }}>
            Inventario de Ingredientes
          </h2>
          {ingredientes.length === 0 ? (
            <p style={{ 
              color: "#8D6E63", 
              fontSize: "18px",
              fontStyle: "italic",
              textAlign: "center",
              padding: "40px"
            }}>
              No hay ingredientes registrados
            </p>
          ) : (
            <div style={{ display: "grid", gap: "20px" }}>
              {ingredientes.map((ingrediente, index) => {
                const stock = parseInt(ingrediente.Stock || ingrediente.stock || 0);
                const stockBajo = stock <= 10;
                return (
                  <div
                    key={ingrediente.ID_Ingrediente || index}
                    style={{
                      border: stockBajo ? "3px solid #F43F5E" : "2px solid #D7CCC8",
                      borderRadius: "16px",
                      padding: "24px",
                      background: stockBajo ? "#FFF3E0" : "#FFFFFF",
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
                          {ingrediente.Nombre || ingrediente.nombre || "Sin nombre"}
                        </h3>
                        <p style={{ color: "#8D6E63", margin: "4px 0", fontSize: "16px" }}>
                          <strong>Descripción:</strong> {ingrediente.Descripcion || ingrediente.descripcion || "Sin descripción"}
                        </p>
                        <p style={{ 
                          color: stockBajo ? "#F43F5E" : "#8D6E63", 
                          margin: "4px 0", 
                          fontSize: "18px",
                          fontWeight: stockBajo ? 700 : 500
                        }}>
                          <strong>Stock:</strong> {stock} unidades
                        </p>
                      </div>
                      {stockBajo && (
                        <div style={{
                          padding: "8px 16px",
                          borderRadius: "8px",
                          background: "#F43F5E",
                          color: "white",
                          fontWeight: 600,
                          fontSize: "14px"
                        }}>
                          Stock Bajo
                        </div>
                      )}
                    </div>

                    <div style={{ 
                      display: "flex", 
                      gap: "12px",
                      marginTop: "16px",
                      paddingTop: "16px",
                      borderTop: "2px solid #D7CCC8",
                      alignItems: "center"
                    }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={{ fontSize: "14px", color: "#8D6E63", fontWeight: 500 }}>
                          Reducir stock a:
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={stock}
                          value={stockInputs[ingrediente.ID_Ingrediente] !== undefined ? stockInputs[ingrediente.ID_Ingrediente] : stock}
                          onChange={(e) => {
                            const nuevoValor = parseInt(e.target.value) || 0;
                            setStockInputs({
                              ...stockInputs,
                              [ingrediente.ID_Ingrediente]: nuevoValor
                            });
                          }}
                          onBlur={(e) => {
                            const nuevoStock = parseInt(e.target.value) || 0;
                            if (nuevoStock !== stock && nuevoStock <= stock) {
                              actualizarStock(ingrediente.ID_Ingrediente || index, nuevoStock, stock);
                            } else if (nuevoStock > stock) {
                              // Restaurar el valor si intenta aumentar
                              setStockInputs({
                                ...stockInputs,
                                [ingrediente.ID_Ingrediente]: stock
                              });
                            }
                          }}
                          style={{
                            padding: "10px",
                            border: "2px solid #D7CCC8",
                            borderRadius: "8px",
                            fontSize: "16px",
                            color: "#3E2723",
                            background: "#F5E6D3",
                            width: "120px"
                          }}
                        />
                        <span style={{ fontSize: "12px", color: "#8D6E63", fontStyle: "italic" }}>
                          Solo puedes reducir (máx: {stock})
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                        <button
                          onClick={() => {
                            const nuevoStock = stockInputs[ingrediente.ID_Ingrediente] !== undefined 
                              ? stockInputs[ingrediente.ID_Ingrediente] 
                              : stock;
                            if (nuevoStock <= stock && nuevoStock >= 0) {
                              actualizarStock(ingrediente.ID_Ingrediente || index, nuevoStock, stock);
                            }
                          }}
                          style={{
                            padding: "10px 20px",
                            background: "#8D6E63",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: 600,
                            transition: "background 0.2s",
                            height: "fit-content"
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#5D4037"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "#8D6E63"}
                        >
                          Reducir Stock
                        </button>
                        {stockBajo && (
                          <button
                            onClick={() => avisarAdmin(ingrediente.ID_Ingrediente || index)}
                            style={{
                              padding: "10px 20px",
                              background: "#F43F5E",
                              color: "white",
                              border: "none",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontWeight: 600,
                              transition: "background 0.2s",
                              height: "fit-content"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "#DC2626"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "#F43F5E"}
                          >
                            Avisar al Admin
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Chef;

