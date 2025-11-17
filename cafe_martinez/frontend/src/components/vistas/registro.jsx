import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
    ID_Cargo: "5",
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
      Administrador: 1,
      Recepcionista: 2,
      Mozo: 3,
      Chef: 4,
      Cliente: 5,
    };
    
    // Determinar ID_Cargo: primero intenta usar ID_Cargo, luego cargo, y finalmente usa 5 (Cliente) por defecto
    let idCargo = 5; // Valor por defecto: Cliente
    if (usuario.ID_Cargo) {
      const parsedId = parseInt(usuario.ID_Cargo, 10);
      if (!isNaN(parsedId) && parsedId > 0) {
        idCargo = parsedId;
      }
    } else if (usuario.cargo && cargoMap[usuario.cargo]) {
      idCargo = cargoMap[usuario.cargo];
    }
    
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
          cargo: "Cliente",
          ID_Cargo: "5",
        });
        navigate("/login");
      })
      .catch((err) => {
        console.error(err);
        alert("No se pudo registrar el usuario");
      });
  };

  return (
    <div style={{ 
      fontFamily: "'Crimson Text', 'Georgia', 'Times New Roman', serif", 
      color: "#3E2723",
      background: "linear-gradient(to bottom, #F5E6D3 0%, #EFEBE9 100%)",
      minHeight: "100vh",
      paddingTop: "60px"
    }}>
      <div style={{ 
        textAlign: "center", 
        marginBottom: "40px",
        paddingTop: "20px"
      }}>
        <h1 style={{ 
          fontSize: "64px", 
          margin: 0,
          color: "#3E2723",
          fontFamily: "'Playfair Display', 'Georgia', serif",
          fontWeight: 700,
          letterSpacing: "2px"
        }}>
          Café Martínez
        </h1>
      </div>
      <main style={{ 
        maxWidth: 600, 
        margin: "50px auto", 
        padding: "50px 30px",
        background: "#FFFFFF",
        borderRadius: "20px",
        boxShadow: "0 8px 24px rgba(61,39,35,.15)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ 
            fontSize: "42px", 
            marginTop: 0, 
            marginBottom: "10px",
            color: "#3E2723",
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontWeight: 700,
            letterSpacing: "1px"
          }}>
            Crear Cuenta
          </h1>
          <p style={{ 
            fontSize: "18px", 
            color: "#8D6E63",
            fontStyle: "italic"
          }}>
            Unite a nuestra comunidad de amantes del café
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <input
            type="text"
            name="nombre"
            value={usuario.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            maxLength={50}
            required
            style={{
              padding: "14px 18px",
              border: "2px solid #D7CCC8",
              borderRadius: "12px",
              fontSize: "16px",
              color: "#3E2723",
              background: "#F5E6D3",
              fontFamily: "'Crimson Text', serif",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#8D6E63"}
            onBlur={(e) => e.target.style.borderColor = "#D7CCC8"}
          />
          <input
            type="text"
            name="apellido"
            value={usuario.apellido}
            onChange={handleChange}
            placeholder="Apellido"
            maxLength={50}
            required
            style={{
              padding: "14px 18px",
              border: "2px solid #D7CCC8",
              borderRadius: "12px",
              fontSize: "16px",
              color: "#3E2723",
              background: "#F5E6D3",
              fontFamily: "'Crimson Text', serif",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#8D6E63"}
            onBlur={(e) => e.target.style.borderColor = "#D7CCC8"}
          />
          <input
            type="date"
            name="nacimiento"
            value={usuario.nacimiento}
            onChange={handleChange}
            required
            style={{
              padding: "14px 18px",
              border: "2px solid #D7CCC8",
              borderRadius: "12px",
              fontSize: "16px",
              color: "#3E2723",
              background: "#F5E6D3",
              fontFamily: "'Crimson Text', serif",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#8D6E63"}
            onBlur={(e) => e.target.style.borderColor = "#D7CCC8"}
          />
          <select
            name="sexo"
            value={usuario.sexo}
            onChange={handleChange}
            required
            style={{
              padding: "14px 18px",
              border: "2px solid #D7CCC8",
              borderRadius: "12px",
              fontSize: "16px",
              color: "#3E2723",
              background: "#F5E6D3",
              fontFamily: "'Crimson Text', serif",
              transition: "border-color 0.2s",
              cursor: "pointer"
            }}
            onFocus={(e) => e.target.style.borderColor = "#8D6E63"}
            onBlur={(e) => e.target.style.borderColor = "#D7CCC8"}
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
            placeholder="Correo electrónico"
            maxLength={50}
            required
            style={{
              padding: "14px 18px",
              border: "2px solid #D7CCC8",
              borderRadius: "12px",
              fontSize: "16px",
              color: "#3E2723",
              background: "#F5E6D3",
              fontFamily: "'Crimson Text', serif",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#8D6E63"}
            onBlur={(e) => e.target.style.borderColor = "#D7CCC8"}
          />
          <input
            type="password"
            name="clave"
            value={usuario.clave}
            onChange={handleChange}
            placeholder="Contraseña"
            maxLength={50}
            required
            style={{
              padding: "14px 18px",
              border: "2px solid #D7CCC8",
              borderRadius: "12px",
              fontSize: "16px",
              color: "#3E2723",
              background: "#F5E6D3",
              fontFamily: "'Crimson Text', serif",
              transition: "border-color 0.2s"
            }}
            onFocus={(e) => e.target.style.borderColor = "#8D6E63"}
            onBlur={(e) => e.target.style.borderColor = "#D7CCC8"}
          />

          <button 
            type="submit" 
            style={{
              padding: "14px 24px",
              background: "#5D4037",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "18px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Playfair Display', serif",
              transition: "background 0.2s",
              marginTop: "10px"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#3E2723"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#5D4037"}
          >
            Registrarse
          </button>

          <p style={{ 
            textAlign: "center", 
            marginTop: "20px",
            color: "#8D6E63",
            fontSize: "16px"
          }}>
            ¿Ya tenés cuenta?{" "}
            <Link 
              to="/login" 
              style={{ 
                color: "#5D4037", 
                textDecoration: "none",
                fontWeight: 600,
                borderBottom: "1px solid #5D4037"
              }}
            >
              Iniciá sesión aquí
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default RegistroForm;

