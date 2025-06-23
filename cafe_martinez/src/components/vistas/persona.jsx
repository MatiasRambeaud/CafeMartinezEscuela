import React, { useState } from "react";
import "../../styles/PersonaForm.css";

const PersonaForm = () => {
  const [persona, setPersona] = useState({
    dni: "",
    nombre: "",
    apellido: "",
    nacimiento: "",
    sexo: "",
    fecha_contratacion: "",
    activo: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPersona((prevPersona) => ({
      ...prevPersona,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <h2>Formulario de Persona</h2>

      <input
        type="text"
        name="dni"
        value={persona.dni}
        onChange={handleChange}
        placeholder="DNI"
        maxlength="8"
        minlength="8"
        className="campo"
      />
      <input
        type="text"
        name="nombre"
        value={persona.nombre}
        onChange={handleChange}
        placeholder="Nombre"
        maxlength="50"
        className="campo"
      />
      <input
        type="text"
        name="apellido"
        value={persona.apellido}
        onChange={handleChange}
        placeholder="Apellido"
        maxlength="50"
        className="campo"
      />
      <input
        type="date"
        name="nacimiento"
        value={persona.nacimiento}
        onChange={handleChange}
        className="campo"
      />
      <select
        name="sexo"
        value={persona.sexo}
        onChange={handleChange}
        className="campo"
      >
        <option value="">Seleccione sexo</option>
        <option value="M">Masculino</option>
        <option value="F">Femenino</option>
      </select>

      <button type="submit" className="boton">
        Guardar
      </button>
    </form>
  );
};

export default PersonaForm;
