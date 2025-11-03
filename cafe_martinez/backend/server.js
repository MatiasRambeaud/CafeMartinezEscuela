const express = require("express");
const cors = require("cors");
const connection = require("../frontend/database"); // Asegúrate de que este archivo exporte una conexión válida

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Ruta para obtener todos los usuarios
app.get("/usuarios", (req, res) => {
  connection.query("SELECT * FROM usuario", (err, results) => {
    if (err) {
      console.error("Error al obtener usuario:", err);
      return res.status(500).json({ error: err.sqlMessage || "Error en la base de datos" });
    }
    res.json(results);
  });
});

app.get("/api/usuario/:id", (req, res) => {
  const id = req.params.id;
  connection.query("SELECT * FROM usuario WHERE ID_Usuario = ?", [id], (err, results) => {
    if (err) {
      console.error("Error al obtener usuario:", err);
      return res.status(500).json({ error: err.sqlMessage || "Error en la base de datos" });
    }
    res.json(results);
  });
});

// Login: validar credenciales
app.post("/api/login", (req, res) => {
  const { correo, clave } = req.body;
  const sql = "SELECT * FROM usuario WHERE Correo = ? AND Clave = ? LIMIT 1";
  connection.query(sql, [correo, clave], (err, results) => {
    if (err) {
      console.error("Error en login:", err);
      return res.status(500).json({ error: err.sqlMessage || "Error en la base de datos" });
    }
    if (!results || results.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    res.json(results[0]);
  });
});

// Ruta para guardar usuario
app.post("/api/usuario", (req, res) => {
  const {
    nombre,
    apellido,
    nacimiento,
    sexo,
    correo,
    clave,
    ID_Cargo,
  } = req.body;

  const sql = `
    INSERT INTO usuario 
    (Nombre, Apellido, Nacimiento, Sexo, Correo, Clave, ID_Cargo) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [nombre, apellido, nacimiento, sexo, correo, clave, ID_Cargo],
    (err, result) => {
      if (err) {
        console.error("Error al insertar usuario:", err);
        return res.status(500).json({ error: err.sqlMessage || "Error al guardar usuario" });
      }
      res.status(201).json({ message: "Usuario guardado correctamente" });
    }
  );
});

app.delete("/api/usuario/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM usuario WHERE ID_Usuario = ?", [id], (err, results) => {
    if (err) {
      console.error("Error al eliminar usuario:", err);
      return res.status(500).json({ error: err.sqlMessage || "Error en la base de datos" });
    }
    res.json(results);
  });
});

// Ruta para actualizar un usuario por ID
app.put("/api/usuario/:id", (req, res) => {
  const id = req.params.id;
  console.log(id)
  const {
    nombre,
    apellido,
    nacimiento,
    sexo,
    correo,
    clave,
    ID_Cargo,
  } = req.body;

  const sql = `
    UPDATE usuario 
    SET Nombre = ?, Apellido = ?, Nacimiento = ?, Sexo = ?, Correo = ?, Clave = ?, ID_Cargo = ?
    WHERE ID_Usuario = ?
  `;

  connection.query(
    sql,
    [nombre, apellido, nacimiento, sexo, correo, clave, ID_Cargo, id],
    (err, result) => {
      if (err) {
        console.error("Error al actualizar usuario:", err);
        return res.status(500).json({ error: err.sqlMessage || "Error al modificar usuario" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.status(200).json({ message: "Usuario modificado correctamente" });
    }
  );
});



// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});

