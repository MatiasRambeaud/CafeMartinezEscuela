import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UsuarioForm from "../components/vistas/usuario";
import PersonaForm from "../components/vistas/persona";

const RouterAdmin = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin/persona" element={<PersonaForm />} />
        <Route path="/admin/usuario" element={<UsuarioForm />} />
      </Routes>
    </Router>
  );
};

export default RouterAdmin;
