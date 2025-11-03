import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/RegistroForm.css";

const RegistroForm = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    nacimiento: "",
    sexo: "",
    correo: "",
    clave: "",
    cargo: "Cliente",
    ID_Cargo: "6",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cargoMap = {
      "1": 1,
      "2": 2,
      "3": 3,
      "4": 4,
      "5": 5,
      "6": 6,
      Administrador: 1,
      Recepcionista: 2,
      Mozo: 3,
      Chef: 4,
      Manager: 5,
      Cliente: 6,
    };
    const idCargo = Number(usuario.ID_Cargo) || cargoMap[usuario.cargo] || null;
    const payload = {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      nacimiento: usuario.nacimiento,
      sexo: usuario.sexo,
      correo: usuario.correo,
      clave: usuario.clave,
      ID_Cargo: idCargo,
    };

    fetch("http://localhost:3000/api/usuario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Error al guardar usuario");
        }
        return res.json();
      })
      .then(() => {
        alert("Usuario registrado correctamente");
        setUsuario({
          nombre: "",
          apellido: "",
          nacimiento: "",
          sexo: "",
          correo: "",
          clave: "",
        });
        navigate("/login");
      })
      .catch((err) => {
        console.error(err);
        alert("No se pudo registrar el usuario");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <h2>Formulario de Registro</h2>

      <input
        type="text"
        name="nombre"
        value={usuario.nombre}
        onChange={handleChange}
        placeholder="Nombre"
        maxLength={50}
        className="campo"
        required
      />
      <input
        type="text"
        name="apellido"
        value={usuario.apellido}
        onChange={handleChange}
        placeholder="Apellido"
        maxLength={50}
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
      <select
        name="sexo"
        value={usuario.sexo}
        onChange={handleChange}
        className="campo"
        required
      >
        <option value="">Seleccione sexo</option>
        <option value="M">Masculino</option>
        <option value="F">Femenino</option>
      </select>

      <input
        type="email"
        name="correo"
        value={usuario.correo}
        onChange={handleChange}
        placeholder="Correo"
        maxLength={50}
        className="campo"
        required
      />
      <input
        type="password"
        name="clave"
        value={usuario.clave}
        onChange={handleChange}
        placeholder="Clave"
        maxLength={50}
        className="campo"
        required
      />

      <button type="submit" className="boton">
        Registrarse
      </button>

      <p>¿Ya tenés cuenta? <a href="/login">Inicia sesión</a></p>
    </form>
);
};

export default RegistroForm;

