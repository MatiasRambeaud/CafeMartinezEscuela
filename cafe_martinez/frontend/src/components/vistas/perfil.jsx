import React, { useEffect, useMemo, useState } from "react";
import Nav from "../common/Nav";

const Perfil = () => {
  const readUsuario = () => {
    try {
      const raw = localStorage.getItem("usuario");
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  };
  const [usuario, setUsuario] = useState(readUsuario);

  // Actualizar el usuario si cambia en otra pestaña o al volver el foco
  useEffect(() => {
    const update = () => setUsuario(readUsuario());
    window.addEventListener("storage", update);
    window.addEventListener("focus", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("focus", update);
    };
  }, []);

  // Mapa local fijo de cargos (sin consultar backend)
  const CARGO_MAP = {
    1: "Administrador",
    2: "Recepcionista",
    3: "Mozo",
    4: "Chef",
    6: "Cliente",
  };

  const cargoNombre = useMemo(() => {
    if (!usuario) return "";
    const directo = usuario.CargoNombre || usuario.cargoNombre || usuario.CargoNombreDescripcion || usuario.CargoNombreCargo || usuario.Nombre_Cargo || usuario.Cargo?.Nombre || usuario.cargo?.nombre || usuario.Cargo?.Nombre_Cargo || usuario.cargo?.Nombre_Cargo;
    if (directo) return String(directo);
    const posibleId = usuario.CargoId || usuario.cargoId || usuario.IdCargo || usuario.idCargo || usuario.ID_Cargo || (typeof usuario.Cargo === "number" ? usuario.Cargo : undefined) || (typeof usuario.cargo === "number" ? usuario.cargo : undefined);
    const idNum = Number(posibleId);
    if (Number.isFinite(idNum) && CARGO_MAP[idNum]) return CARGO_MAP[idNum];
    return "";
  }, [usuario]);

  // Formato latino para nacimiento: DD/MM/AAAA
  const nacimientoFormato = useMemo(() => {
    if (!usuario) return "";
    const raw = usuario.Nacimiento || usuario.nacimiento || usuario.FechaNacimiento || usuario.fechaNacimiento;
    if (!raw) return "";
    const str = String(raw);
    // Soportar timestamps, ISO, YYYY-MM-DD, DD/MM/YYYY
    const d = new Date(str);
    if (!Number.isFinite(d.getTime())) {
      // Si ya viene en formato latino, devolverlo tal cual sin hora
      const m = str.match(/^(\d{1,2})[\/](\d{1,2})[\/](\d{4})/);
      return m ? `${m[1].padStart(2, "0")}/${m[2].padStart(2, "0")}/${m[3]}` : str;
    }
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }, [usuario]);

  // Normalizar sexo a Masculino/Femenino
  const sexoFormato = useMemo(() => {
    if (!usuario) return "";
    const raw = usuario.Sexo || usuario.sexo || usuario.Genero || usuario.genero;
    if (raw == null) return "";
    const val = String(raw).trim().toLowerCase();
    if (["m", "masculino", "male", "hombre", "1"].includes(val)) return "Masculino";
    if (["f", "femenino", "female", "mujer", "2"].includes(val)) return "Femenino";
    return raw ? String(raw) : "";
  }, [usuario]);

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", color: "#1f2937" }}>
      <Nav />
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "40px 16px" }}>
        <h1 style={{ fontSize: 32, marginTop: 0 }}>Perfil de usuario</h1>
        {!usuario ? (
          <div style={{ color: "#6b7280" }}>
            No hay sesión activa. Iniciá sesión para ver tu perfil.
          </div>
        ) : (
          <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
            {renderField("Nombre", usuario.Nombre || usuario.nombre)}
            {renderField("Apellido", usuario.Apellido || usuario.apellido)}
            {renderField("Correo", usuario.Correo || usuario.correo)}
            {renderField("Nacimiento", nacimientoFormato)}
            {renderField("Sexo", sexoFormato)}
            {renderField("Cargo", cargoNombre || usuario.Cargo?.Nombre || usuario.cargo?.nombre || usuario.Nombre_Cargo || usuario.Cargo?.Nombre_Cargo)}
          </div>
        )}
      </main>
    </div>
  );
};

function renderField(label, value) {
  if (!value) return null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", alignItems: "center" }}>
      <div style={{ color: "#6b7280" }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{String(value)}</div>
    </div>
  );
}

export default Perfil;


