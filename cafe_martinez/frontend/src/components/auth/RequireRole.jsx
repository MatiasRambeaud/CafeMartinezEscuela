import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAdminUser, isMozo, isRecepcionista, isChef } from "./roles";

const RequireRole = ({ children, allowedRoles }) => {
  const location = useLocation();

  let usuario = null;
  try {
    const raw = localStorage.getItem("usuario");
    usuario = raw ? JSON.parse(raw) : null;
  } catch (_) {
    usuario = null;
  }

  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar si el usuario tiene alguno de los roles permitidos
  const hasRole = allowedRoles.some(role => {
    if (role === "admin") return isAdminUser(usuario);
    if (role === "mozo") return isMozo(usuario);
    if (role === "recepcionista") return isRecepcionista(usuario);
    if (role === "chef") return isChef(usuario);
    return false;
  });

  if (!hasRole) {
    // Redirigir según el rol del usuario
    const cargoId = Number(usuario.ID_Cargo || usuario.IdCargo || usuario.idCargo || usuario.CargoId || usuario.cargoId || 0);
    
    if (cargoId === 1) {
      return <Navigate to="/admin" state={{ from: location }} replace />;
    } else if (cargoId === 2) {
      return <Navigate to="/recepcionista" state={{ from: location }} replace />;
    } else if (cargoId === 3) {
      return <Navigate to="/mozo" state={{ from: location }} replace />;
    } else if (cargoId === 4) {
      return <Navigate to="/chef" state={{ from: location }} replace />;
    } else {
      return <Navigate to="/menu" state={{ from: location }} replace />;
    }
  }

  return children;
};

export default RequireRole;

