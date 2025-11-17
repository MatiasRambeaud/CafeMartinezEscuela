export function isAdminUser(usuario) {
  if (!usuario) return false;
  const rol = (usuario.Rol || usuario.rol || usuario.Role || usuario.role || "").toString().toLowerCase();
  if (rol === "admin" || rol === "administrator" || rol === "administrador") return true;
  if (usuario.EsAdmin === true || usuario.isAdmin === true) return true;

  const cargoNombre = (usuario.Cargo?.Nombre || usuario.cargo?.nombre || usuario.Nombre_Cargo || "").toString().toLowerCase();
  if (cargoNombre === "administrador") return true;
  const cargoId = Number(
    usuario.ID_Cargo || usuario.IdCargo || usuario.idCargo || usuario.CargoId || usuario.cargoId ||
    (typeof usuario.Cargo === "number" ? usuario.Cargo : undefined) || (typeof usuario.cargo === "number" ? usuario.cargo : undefined)
  );
  if (Number.isFinite(cargoId) && cargoId === 1) return true;

  return false;
}

export function isMozo(usuario) {
  if (!usuario) return false;
  const cargoId = Number(
    usuario.ID_Cargo || usuario.IdCargo || usuario.idCargo || usuario.CargoId || usuario.cargoId ||
    (typeof usuario.Cargo === "number" ? usuario.Cargo : undefined) || (typeof usuario.cargo === "number" ? usuario.cargo : undefined)
  );
  return Number.isFinite(cargoId) && cargoId === 3;
}

export function isRecepcionista(usuario) {
  if (!usuario) return false;
  const cargoId = Number(
    usuario.ID_Cargo || usuario.IdCargo || usuario.idCargo || usuario.CargoId || usuario.cargoId ||
    (typeof usuario.Cargo === "number" ? usuario.Cargo : undefined) || (typeof usuario.cargo === "number" ? usuario.cargo : undefined)
  );
  return Number.isFinite(cargoId) && cargoId === 2;
}

export function isChef(usuario) {
  if (!usuario) return false;
  const cargoId = Number(
    usuario.ID_Cargo || usuario.IdCargo || usuario.idCargo || usuario.CargoId || usuario.cargoId ||
    (typeof usuario.Cargo === "number" ? usuario.Cargo : undefined) || (typeof usuario.cargo === "number" ? usuario.cargo : undefined)
  );
  return Number.isFinite(cargoId) && cargoId === 4;
}


