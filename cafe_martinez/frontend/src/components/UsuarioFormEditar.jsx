import React, { useState, useEffect } from "react";

const UsuarioFormEditar = ({ usuario, onCancel, onUpdate }) => {
  const [formData, setFormData] = useState({
    nombre: usuario?.Nombre || "",
    apellido: usuario?.Apellido || "",
    nacimiento: usuario?.Nacimiento ? String(usuario.Nacimiento).slice(0, 10) : "",
    sexo: usuario?.Sexo || "",
    correo: usuario?.Correo || "",
    clave: usuario?.Clave || "",
    ID_Cargo: usuario?.ID_Cargo || 6,
  });

  useEffect(() => {
    setFormData({
      nombre: usuario?.Nombre || "",
      apellido: usuario?.Apellido || "",
      nacimiento: usuario?.Nacimiento ? String(usuario.Nacimiento).slice(0, 10) : "",
      sexo: usuario?.Sexo || "",
      correo: usuario?.Correo || "",
      clave: usuario?.Clave || "",
      ID_Cargo: usuario?.ID_Cargo || 6,
    });
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const usuario_edicion = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        nacimiento: formData.nacimiento,
        correo: formData.correo,
        clave: formData.clave,
        sexo: formData.sexo,
        ID_Cargo: parseInt(formData.ID_Cargo, 10)
      };  
      const response = await fetch(`http://localhost:3000/api/usuario/${usuario.ID_Usuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario_edicion)
      });

      if (response.ok) {
        alert("Usuario modificado correctamente");
        onUpdate(); // Llamar al callback para refrescar la lista
      } else {
        alert("Error al modificar el usuario");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px", backgroundColor: "#f9f9f9" }}>
      <h2>Editar Usuario</h2>

      <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required />
      <input name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" required />
      <input type="date" name="nacimiento" value={formData.nacimiento} onChange={handleChange} required />
      <input name="sexo" value={formData.sexo} onChange={handleChange} placeholder="Sexo" required />
      <input type="email" name="correo" value={formData.correo} onChange={handleChange} placeholder="Correo" required />
      <input type="password" name="clave" value={formData.clave} onChange={handleChange} placeholder="Clave" required />

      <select name="ID_Cargo" value={formData.ID_Cargo} onChange={handleChange}>
        <option value="1">Administrador</option>
        <option value="2">Recepcionista</option>
        <option value="3">Mozo</option>
        <option value="4">Chef</option>
        <option value="5">Manager</option>
        <option value="6">Cliente</option>
      </select>

      <div style={{ marginTop: "10px" }}>
        <button type="submit">Guardar cambios</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default UsuarioFormEditar;

