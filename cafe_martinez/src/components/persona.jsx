import React, { useState } from "react";

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
    console.log("Persona guardada:", persona);
    // Aquí podrías enviar los datos al backend
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Formulario de Persona</h2>
      <input
        type="text"
        name="dni"
        value={persona.dni}
        onChange={handleChange}
        placeholder="DNI"
        className="block w-full mb-2 p-2 border rounded"
      />
      <input
        type="text"
        name="nombre"
        value={persona.nombre}
        onChange={handleChange}
        placeholder="Nombre"
        className="block w-full mb-2 p-2 border rounded"
      />
      <input
        type="text"
        name="apellido"
        value={persona.apellido}
        onChange={handleChange}
        placeholder="Apellido"
        className="block w-full mb-2 p-2 border rounded"
      />
      <input
        type="date"
        name="nacimiento"
        value={persona.nacimiento}
        onChange={handleChange}
        className="block w-full mb-2 p-2 border rounded"
      />
      <select
        name="sexo"
        value={persona.sexo}
        onChange={handleChange}
        className="block w-full mb-2 p-2 border rounded"
      >
        <option value="">Seleccione sexo</option>
        <option value="M">Masculino</option>
        <option value="F">Femenino</option>
        <option value="O">Otro</option>
      </select>
      <input
        type="date"
        name="fecha_contratacion"
        value={persona.fecha_contratacion}
        onChange={handleChange}
        className="block w-full mb-2 p-2 border rounded"
      />
      <label className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          name="activo"
          checked={persona.activo}
          onChange={handleChange}
        />
        <span>Activo</span>
      </label>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Guardar
      </button>
    </form>
  );
};

export default PersonaForm;
