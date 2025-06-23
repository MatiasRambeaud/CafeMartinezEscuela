import React, { useState } from "react";
import "../../styles/UsuarioForm.css";

const UsuarioForm = () => {
  const [usuario, setUsuario] = useState({
    correo: "",
    clave: "",
    ID_Cargo: "",
    DNI: "",
    cargo: "",
    activo: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <h2>Formulario de Usuario</h2>

      <input
        type="email"
        name="correo"
        value={usuario.correo}
        onChange={handleChange}
        placeholder="Correo"
        maxlength="50"
        className="campo"
        required
      />
      <input
        type="password"
        name="clave"
        value={usuario.clave}
        onChange={handleChange}
        placeholder="Clave"
        maxlength="50"
        className="campo"
        required
      />
      <input
        type="text"
        name="ID_Cargo"
        value={usuario.ID_Cargo}
        onChange={handleChange}
        placeholder="ID del Cargo"
        maxlength="11"
        className="campo"
        required
      />
      <input
        type="text"
        name="DNI"
        value={usuario.DNI}
        onChange={handleChange}
        placeholder="DNI"
        maxlength="8"
        minlength="8"
        className="campo"
        required
      />

      <select
        name="cargo"
        value={usuario.cargo}
        onChange={handleChange}
        className="campo"
      >
        <option value="">Seleccione cargo</option>
        <option value="1">Administrador</option>
        <option value="2">Recepcionista</option>
        <option value="3">Mozo</option>
        <option value="4">Chef</option>
        <option value="5">Manager</option>
      </select>

      <label className="checkbox-label">
        <input
          type="checkbox"
          name="activo"
          checked={usuario.activo}
          onChange={handleChange}
        />
        <span>Activo</span>
      </label>

      <button type="submit" className="boton">
        Guardar
      </button>
    </form>
  );
};

export default UsuarioForm;
