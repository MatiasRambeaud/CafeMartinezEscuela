import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { isAdminUser, isMozo, isRecepcionista, isChef } from "../auth/roles";

const Nav = () => {
  const navigate = useNavigate();
  const baseLink = { textDecoration: "none", color: "#5D4037", fontSize: 18, padding: "8px 10px", borderRadius: 10, transition: "all .15s ease", fontWeight: 500 };
  const hoverLink = { background: "#EFEBE9", color: "#3E2723" };
  const activeLink = { background: "#D7CCC8", color: "#3E2723", boxShadow: "inset 0 0 0 1px #BCAAA4" };
  const button = { padding: "10px 14px", borderRadius: 10, background: "#5D4037", color: "white", textDecoration: "none", fontSize: 16, fontWeight: 600, cursor: "pointer", border: "none" };
  const buttonHover = { background: "#3E2723", boxShadow: "0 6px 16px rgba(61,39,35,.25)" };

  const LinkItem = ({ to, children, isButton, onClick }) => {
    const [hover, setHover] = useState(false);
    if (onClick) {
      return (
        <button
          onClick={onClick}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{ ...button, ...(hover ? buttonHover : {}) }}
        >
          {children}
        </button>
      );
    }
    return (
      <NavLink
        to={to}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={({ isActive }) => {
          const styles = { ...(isButton ? button : baseLink) };
          if (!isButton && hover) Object.assign(styles, hoverLink);
          if (!isButton && isActive) Object.assign(styles, activeLink);
          if (isButton && hover) Object.assign(styles, buttonHover);
          return styles;
        }}
      >
        {children}
      </NavLink>
    );
  };

  const [esAdmin, setEsAdmin] = useState(false);
  const [esMozo, setEsMozo] = useState(false);
  const [esRecepcionista, setEsRecepcionista] = useState(false);
  const [esChef, setEsChef] = useState(false);
  const [esCliente, setEsCliente] = useState(false);
  const [usuarioLogueado, setUsuarioLogueado] = useState(false);

  useEffect(() => {
    const check = () => {
      try {
        const raw = localStorage.getItem("usuario");
        const user = raw ? JSON.parse(raw) : null;
        setUsuarioLogueado(!!user);
        setEsAdmin(isAdminUser(user));
        setEsMozo(isMozo(user));
        setEsRecepcionista(isRecepcionista(user));
        setEsChef(isChef(user));
        
        // Verificar si es cliente (ID_Cargo = 5)
        if (user) {
          const cargoId = Number(user.ID_Cargo || user.IdCargo || user.idCargo || user.CargoId || user.cargoId || 0);
          setEsCliente(cargoId === 5);
        } else {
          setEsCliente(false);
        }
      } catch (_) {
        setUsuarioLogueado(false);
        setEsAdmin(false);
        setEsMozo(false);
        setEsRecepcionista(false);
        setEsChef(false);
        setEsCliente(false);
      }
    };
    check();
    window.addEventListener("storage", check);
    window.addEventListener("focus", check);
    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener("focus", check);
    };
  }, []);

  const handleCerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuarioLogueado(false);
    setEsAdmin(false);
    setEsMozo(false);
    setEsRecepcionista(false);
    setEsChef(false);
    setEsCliente(false);
    navigate("/login", { replace: true });
  };

  // Determinar si mostrar la navegación completa (solo para clientes o usuarios no logueados)
  const mostrarNavegacionCompleta = !usuarioLogueado || esCliente;
  const esRolEmpleado = esAdmin || esMozo || esRecepcionista || esChef;

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "#F5E6D3cc", backdropFilter: "blur(8px)", borderBottom: "2px solid #D7CCC8", boxShadow: "0 2px 8px rgba(61,39,35,.1)" }}>
      <nav style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 24, color: "#3E2723", fontFamily: "'Georgia', 'Times New Roman', serif" }}>Café Martínez</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {mostrarNavegacionCompleta && (
            <>
              <LinkItem to="/menu">Inicio</LinkItem>
              <LinkItem to="/nosotros">Nosotros</LinkItem>
              <LinkItem to="/contacto">Contacto</LinkItem>
              {esAdmin && <LinkItem to="/admin" isButton>Admin</LinkItem>}
              {esMozo && <LinkItem to="/mozo" isButton>Mozo</LinkItem>}
              {esRecepcionista && <LinkItem to="/recepcionista" isButton>Recepcionista</LinkItem>}
              {esChef && <LinkItem to="/chef" isButton>Chef</LinkItem>}
              <LinkItem to="/perfil">Perfil</LinkItem>
            </>
          )}
          {usuarioLogueado ? (
            <LinkItem onClick={handleCerrarSesion} isButton>Cerrar Sesión</LinkItem>
          ) : (
            <LinkItem to="/login" isButton>Login</LinkItem>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Nav;
