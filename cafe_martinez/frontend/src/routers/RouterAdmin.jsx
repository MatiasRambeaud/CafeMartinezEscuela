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

const RouterAdmin = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/admin/persona" element={<PersonaForm />} />
        <Route path="/admin/usuario" element={<UsuarioForm />} />
        <Route path="/registro" element={<RegistroForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/admin/usuarios" element={<ListaUsuarios />} />
        <Route path="/admin/editar" element={<UsuarioFormEditar />} />

      </Routes>
    </Router>
  );
};

export default RouterAdmin;
