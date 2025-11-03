import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Nav = () => {
  const baseLink = { textDecoration: "none", color: "#374151", fontSize: 18, padding: "8px 10px", borderRadius: 10, transition: "all .15s ease" };
  const hoverLink = { background: "#eef2ff", color: "#111827" };
  const activeLink = { background: "#e0e7ff", color: "#111827", boxShadow: "inset 0 0 0 1px #c7d2fe" };
  const button = { padding: "10px 14px", borderRadius: 10, background: "#111827", color: "white", textDecoration: "none", fontSize: 16 };
  const buttonHover = { background: "#0b1220", boxShadow: "0 6px 16px rgba(17,24,39,.25)" };

  const LinkItem = ({ to, children, isButton }) => {
    const [hover, setHover] = useState(false);
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

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "#ffffffcc", backdropFilter: "blur(8px)", borderBottom: "1px solid #e5e7eb" }}>
      <nav style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 800, fontSize: 22 }}>Cafe Martinez</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <LinkItem to="/">Inicio</LinkItem>
          <LinkItem to="/nosotros">Nosotros</LinkItem>
          <LinkItem to="/contacto">Contacto</LinkItem>
          <LinkItem to="/login" isButton>Login</LinkItem>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
