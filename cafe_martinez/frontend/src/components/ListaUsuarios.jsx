import React, { useEffect, useState } from "react";
import UsuarioFormEditar from "./UsuarioFormEditar"; 

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [usuarioEditando, setUsuarioEditando] = useState(null);


  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = () => {
    fetch("http://localhost:3000/usuarios")
      .then(async (response) => {
        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Error al obtener usuarios");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Datos recibidos:", data);
        setUsuarios(data);
      })
      .catch((err) => {
        console.error("Error al obtener usuarios:", err);
        setError("No se pudo cargar la lista de usuarios.");
      });
  };

  const eliminarUsuario = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (!confirmacion) return;

    try {
      const response = await fetch(`http://localhost:3000/api/usuario/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Usuario eliminado correctamente");
        fetchUsuarios(); // Recargar la lista
      } else {
        alert("Error al eliminar usuario");
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Lista de Usuarios</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Apellido</th>
            <th style={thStyle}>Correo</th>
            <th style={thStyle}>Sexo</th>
            <th style={thStyle}>Nacimiento</th>
            <th style={thStyle}>ID Cargo</th>
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.ID_Usuario}>
              <td style={tdStyle}>{usuario.ID_Usuario}</td>
              <td style={tdStyle}>{usuario.Nombre}</td>
              <td style={tdStyle}>{usuario.Apellido}</td>
              <td style={tdStyle}>{usuario.Correo}</td>
              <td style={tdStyle}>{usuario.Sexo}</td>
              <td style={tdStyle}>{usuario.Nacimiento}</td>
              <td style={tdStyle}>{usuario.ID_Cargo}</td>
              <td style={tdStyle}>

              <button onClick={() => setUsuarioEditando(usuario)} 
              style={buttonStyleEdit}>
                Modificar
              </button>

                <button
                  style={buttonStyleDelete}
                  onClick={() => eliminarUsuario(usuario.ID_Usuario)}
                >
                   Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {usuarioEditando && (
  <UsuarioFormEditar
    usuario={usuarioEditando}
    onCancel={() => setUsuarioEditando(null)}
    onUpdate={() => {
      fetchUsuarios();
      setUsuarioEditando(null);
    }}
  />
)}
    </div>
  );
};

// Estilos
const thStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  backgroundColor: "#f2f2f2",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "10px",
};

const buttonStyleEdit = {
  marginRight: "10px",
  padding: "5px 10px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const buttonStyleDelete = {
  padding: "5px 10px",
  backgroundColor: "#f44336",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default Usuarios;
