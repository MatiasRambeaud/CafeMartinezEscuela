import React, { useState } from "react";
import "../../styles/UsuarioForm.css";


const UsuarioForm = () => {
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    nacimiento: "",
    sexo: "",
    correo: "",
    clave: "",
    ID_Cargo: "6", // valor por defecto (Cliente)
    activo: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      });

      if (response.ok) {
        alert("Usuario guardado correctamente");
        setUsuario({
          nombre: "",
          apellido: "",
          nacimiento: "",
          sexo: "",
          correo: "",
          clave: "",
          ID_Cargo: "6",
          activo: true,
        });
      } else {
        alert("Error al guardar el usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error en la conexión con el servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <h2>Formulario de Usuario</h2>

      <input
        type="text"
        name="nombre"
        value={usuario.nombre}
        onChange={handleChange}
        placeholder="Nombre"
        maxLength="50"
        className="campo"
        required
      />
      <input
        type="text"
        name="apellido"
        value={usuario.apellido}
        onChange={handleChange}
        placeholder="Apellido"
        maxLength="50"
        className="campo"
        required
      />
      <input
        type="date"
        name="nacimiento"
        value={usuario.nacimiento}
        onChange={handleChange}
        className="campo"
        required
      />
      <input
        type="text"
        name="sexo"
        value={usuario.sexo}
        onChange={handleChange}
        placeholder="Sexo"
        maxLength="50"
        className="campo"
        required
      />
      <input
        type="email"
        name="correo"
        value={usuario.correo}
        onChange={handleChange}
        placeholder="Correo"
        maxLength="50"
        className="campo"
        required
      />
      <input
        type="password"
        name="clave"
        value={usuario.clave}
        onChange={handleChange}
        placeholder="Clave"
        maxLength="50"
        className="campo"
        required
      />

      {/* Nuevo campo SELECT para ID_Cargo */}
      <select
        name="ID_Cargo"
        value={usuario.ID_Cargo}
        onChange={handleChange}
        className="campo"
        required
      >
        <option value="">Seleccionar Cargo</option>
        <option value="1">Administrador</option>
        <option value="2">Recepcionista</option>
        <option value="3">Mozo</option>
        <option value="4">Chef</option>
        <option value="5">Manager</option>
        <option value="6">Cliente</option>
      </select>

      <button type="submit" className="boton">
        Guardar
      </button>
    </form>
  );
};

export default UsuarioForm;
