import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/LoginForm.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    correo: "",
    clave: "",
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
    fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo: usuario.correo, clave: usuario.clave }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Credenciales inválidas");
        }
        return res.json();
      })
      .then((user) => {
        alert(`Bienvenido ${user.Nombre} ${user.Apellido}`);
        try {
          localStorage.removeItem("usuario");
          localStorage.setItem("usuario", JSON.stringify(user));
        } catch (_) {}
        navigate("/menu", { replace: true });
      })
      .catch((err) => {
        alert(err.message || "Error de inicio de sesión");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <h2>Inicio de sesión</h2>

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
        Iniciar sesión
      </button>

      <p><a href="/registro">¿No tenés cuenta?</a></p>
    </form>
);
};

export default LoginForm;
