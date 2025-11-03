import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAdminUser } from "./roles";

const RequireAdmin = ({ children }) => {
  const location = useLocation();

  let usuario = null;
  try {
    const raw = localStorage.getItem("usuario");
    usuario = raw ? JSON.parse(raw) : null;
  } catch (_) {
    usuario = null;
  }

  const isAdmin = isAdminUser(usuario);

  if (!isAdmin) {
    // Si no está autenticado o no es admin, redirigir
    // Si no hay usuario, volver al login; si hay usuario no admin, al menú
    const to = usuario ? "/menu" : "/login";
    return <Navigate to={to} state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAdmin;


