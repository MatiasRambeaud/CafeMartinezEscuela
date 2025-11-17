import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  
  // Verificar si el usuario ya está logueado y redirigirlo
  useEffect(() => {
    try {
      const raw = localStorage.getItem("usuario");
      if (raw) {
        const user = JSON.parse(raw);
        const cargoId = Number(user.ID_Cargo || user.IdCargo || user.idCargo || user.CargoId || user.cargoId || 0);
        
        if (cargoId === 1) {
          navigate("/admin", { replace: true });
        } else if (cargoId === 2) {
          navigate("/recepcionista", { replace: true });
        } else if (cargoId === 3) {
          navigate("/mozo", { replace: true });
        } else if (cargoId === 4) {
          navigate("/chef", { replace: true });
        } else {
          navigate("/menu", { replace: true });
        }
      }
    } catch (_) {
      // Si hay error al leer el localStorage, continuar con el login
    }
  }, [navigate]);
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
        
        // Redirigir según el rol del usuario
        const cargoId = Number(user.ID_Cargo || user.IdCargo || user.idCargo || user.CargoId || user.cargoId || 0);
        
        if (cargoId === 1) {
          // Admin
          navigate("/admin", { replace: true });
        } else if (cargoId === 2) {
          // Recepcionista
          navigate("/recepcionista", { replace: true });
        } else if (cargoId === 3) {
          // Mozo
          navigate("/mozo", { replace: true });
        } else if (cargoId === 4) {
          // Chef
          navigate("/chef", { replace: true });
        } else {
          // Cliente o cualquier otro rol
          navigate("/menu", { replace: true });
        }
      })
      .catch((err) => {
        alert(err.message || "Error de inicio de sesión");
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
        maxWidth: 500, 
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
            Iniciar Sesión
          </h1>
          <p style={{ 
            fontSize: "18px", 
            color: "#8D6E63",
            fontStyle: "italic"
          }}>
            Bienvenido de vuelta a Café Martínez
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
            Iniciar Sesión
          </button>

          <p style={{ 
            textAlign: "center", 
            marginTop: "20px",
            color: "#8D6E63",
            fontSize: "16px"
          }}>
            ¿No tenés cuenta?{" "}
            <Link 
              to="/registro" 
              style={{ 
                color: "#5D4037", 
                textDecoration: "none",
                fontWeight: 600,
                borderBottom: "1px solid #5D4037"
              }}
            >
              Registrate aquí
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default LoginForm;
