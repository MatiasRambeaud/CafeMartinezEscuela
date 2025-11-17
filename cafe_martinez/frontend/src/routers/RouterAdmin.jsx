import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UsuarioForm from "../components/vistas/usuario";
import PersonaForm from "../components/vistas/persona";
import RegistroForm from "../components/vistas/registro"; 
import LoginForm from "../components/vistas/login";
import ListaUsuarios from "../components/ListaUsuarios";
import UsuarioFormEditar from "../components/UsuarioFormEditar";
import Nosotros from "../components/vistas/nosotros";
import Menu from "../components/vistas/menu";
import Contacto from "../components/vistas/contacto";
import Perfil from "../components/vistas/perfil";
import RequireAdmin from "../components/auth/RequireAdmin";
import RequireRole from "../components/auth/RequireRole";
import AdminPanel from "../components/vistas/adminPanel";
import Cargos from "../components/vistas/admin/Cargos";
import Almacenes from "../components/vistas/admin/Almacenes";
import Ingredientes from "../components/vistas/admin/Ingredientes";
import Menus from "../components/vistas/admin/Menus";
import Comidas from "../components/vistas/admin/Comidas";
import Mozo from "../components/vistas/Mozo";
import Recepcionista from "../components/vistas/Recepcionista";
import Chef from "../components/vistas/Chef";

const RouterAdmin = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/admin" element={<RequireAdmin><AdminPanel /></RequireAdmin>} />
        <Route path="/admin/cargos" element={<RequireAdmin><Cargos /></RequireAdmin>} />
        <Route path="/admin/almacenes" element={<RequireAdmin><Almacenes /></RequireAdmin>} />
        <Route path="/admin/ingredientes" element={<RequireAdmin><Ingredientes /></RequireAdmin>} />
        <Route path="/admin/menus" element={<RequireAdmin><Menus /></RequireAdmin>} />
        <Route path="/admin/comidas" element={<RequireAdmin><Comidas /></RequireAdmin>} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/admin/persona" element={<RequireAdmin><PersonaForm /></RequireAdmin>} />
        <Route path="/admin/usuario" element={<RequireAdmin><UsuarioForm /></RequireAdmin>} />
        <Route path="/registro" element={<RegistroForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/admin/usuarios" element={<RequireAdmin><ListaUsuarios /></RequireAdmin>} />
        <Route path="/admin/editar" element={<RequireAdmin><UsuarioFormEditar /></RequireAdmin>} />
        <Route path="/mozo" element={<RequireRole allowedRoles={["mozo"]}><Mozo /></RequireRole>} />
        <Route path="/recepcionista" element={<RequireRole allowedRoles={["recepcionista"]}><Recepcionista /></RequireRole>} />
        <Route path="/chef" element={<RequireRole allowedRoles={["chef"]}><Chef /></RequireRole>} />

      </Routes>
    </Router>
  );
};

export default RouterAdmin;
