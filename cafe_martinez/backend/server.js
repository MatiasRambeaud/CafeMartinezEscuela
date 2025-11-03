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

// ================= CARGOS =================
// Listar cargos
app.get("/api/cargos", (req, res) => {
  connection.query("SELECT * FROM cargo", (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error en la base de datos" });
    res.json(results);
  });
});

// Obtener cargo por id
app.get("/api/cargos/:id", (req, res) => {
  const { id } = req.params;
  connection.query("SELECT * FROM cargo WHERE ID_Cargo = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error en la base de datos" });
    if (!results || results.length === 0) return res.status(404).json({ error: "Cargo no encontrado" });
    res.json(results[0]);
  });
});

// Crear cargo
app.post("/api/cargos", (req, res) => {
  const { Nombre_Cargo } = req.body;
  if (!Nombre_Cargo) return res.status(400).json({ error: "Nombre_Cargo es requerido" });
  connection.query("INSERT INTO cargo (Nombre_Cargo) VALUES (?)", [Nombre_Cargo], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error al guardar cargo" });
    res.status(201).json({ id: result.insertId, Nombre_Cargo });
  });
});

// Actualizar cargo
app.put("/api/cargos/:id", (req, res) => {
  const { id } = req.params;
  const { Nombre_Cargo } = req.body;
  connection.query("UPDATE cargo SET Nombre_Cargo = ? WHERE ID_Cargo = ?", [Nombre_Cargo, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error al actualizar cargo" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Cargo no encontrado" });
    res.json({ message: "Cargo actualizado" });
  });
});

// Eliminar cargo
app.delete("/api/cargos/:id", (req, res) => {
  const { id } = req.params;
  connection.query("DELETE FROM cargo WHERE ID_Cargo = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error al eliminar cargo" });
    res.json({ message: "Cargo eliminado" });
  });
});

// ================= ALMACEN =================
app.get("/api/almacenes", (req, res) => {
  connection.query("SELECT * FROM almacen", (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    res.json(results);
  });
});
app.get("/api/almacenes/:id", (req, res) => {
  connection.query("SELECT * FROM almacen WHERE ID_Almacen = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    if (!results.length) return res.status(404).json({ error: "No encontrado" });
    res.json(results[0]);
  });
});
app.post("/api/almacenes", (req, res) => {
  const { Nombre, Descripcion, Stock, ID_Usuario } = req.body;
  connection.query("INSERT INTO almacen (Nombre, Descripcion, Stock, ID_Usuario) VALUES (?,?,?,?)", [Nombre, Descripcion, Stock, ID_Usuario], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    res.status(201).json({ id: result.insertId });
  });
});
app.put("/api/almacenes/:id", (req, res) => {
  const { Nombre, Descripcion, Stock, ID_Usuario } = req.body;
  connection.query("UPDATE almacen SET Nombre=?, Descripcion=?, Stock=?, ID_Usuario=? WHERE ID_Almacen = ?", [Nombre, Descripcion, Stock, ID_Usuario, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    if (!result.affectedRows) return res.status(404).json({ error: "No encontrado" });
    res.json({ message: "Actualizado" });
  });
});
app.delete("/api/almacenes/:id", (req, res) => {
  connection.query("DELETE FROM almacen WHERE ID_Almacen = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    res.json({ message: "Eliminado" });
  });
});

// ================= COMIDA =================
app.get("/api/comidas", (req, res) => {
  connection.query("SELECT * FROM comida", (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    res.json(results);
  });
});
app.post("/api/comidas", (req, res) => {
  const { Nombre, Descripcion, ID_Menu } = req.body;
  connection.query("INSERT INTO comida (Nombre, Descripcion, ID_Menu) VALUES (?,?,?)", [Nombre, Descripcion, ID_Menu], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    res.status(201).json({ id: result.insertId });
  });
});
app.put("/api/comidas/:id", (req, res) => {
  const { Nombre, Descripcion, ID_Menu } = req.body;
  connection.query("UPDATE comida SET Nombre=?, Descripcion=?, ID_Menu=? WHERE ID_Comida = ?", [Nombre, Descripcion, ID_Menu, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    if (!result.affectedRows) return res.status(404).json({ error: "No encontrado" });
    res.json({ message: "Actualizado" });
  });
});
app.delete("/api/comidas/:id", (req, res) => {
  connection.query("DELETE FROM comida WHERE ID_Comida = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    res.json({ message: "Eliminado" });
  });
});

// ================= COMPRA =================
app.get("/api/compras", (req, res) => {
  connection.query("SELECT * FROM compra", (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    res.json(results);
  });
});
app.post("/api/compras", (req, res) => {
  const { Metodo, Monto, ID_Usuario } = req.body;
  connection.query("INSERT INTO compra (Metodo, Monto, ID_Usuario) VALUES (?,?,?)", [Metodo, Monto, ID_Usuario], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    res.status(201).json({ id: result.insertId });
  });
});
app.put("/api/compras/:id", (req, res) => {
  const { Metodo, Monto, ID_Usuario } = req.body;
  connection.query("UPDATE compra SET Metodo=?, Monto=?, ID_Usuario=? WHERE ID_Compra = ?", [Metodo, Monto, ID_Usuario, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    if (!result.affectedRows) return res.status(404).json({ error: "No encontrado" });
    res.json({ message: "Actualizado" });
  });
});
app.delete("/api/compras/:id", (req, res) => {
  connection.query("DELETE FROM compra WHERE ID_Compra = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    res.json({ message: "Eliminado" });
  });
});

// ================= INGREDIENTE =================
app.get("/api/ingredientes", (req, res) => {
  connection.query("SELECT * FROM ingrediente", (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    res.json(results);
  });
});
app.post("/api/ingredientes", (req, res) => {
  const { Nombre, Descripcion, ID_Almacen } = req.body;
  connection.query("INSERT INTO ingrediente (Nombre, Descripcion, ID_Almacen) VALUES (?,?,?)", [Nombre, Descripcion, ID_Almacen], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    res.status(201).json({ id: result.insertId });
  });
});
app.put("/api/ingredientes/:id", (req, res) => {
  const { Nombre, Descripcion, ID_Almacen } = req.body;
  connection.query("UPDATE ingrediente SET Nombre=?, Descripcion=?, ID_Almacen=? WHERE ID_Ingrediente = ?", [Nombre, Descripcion, ID_Almacen, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    if (!result.affectedRows) return res.status(404).json({ error: "No encontrado" });
    res.json({ message: "Actualizado" });
  });
});
app.delete("/api/ingredientes/:id", (req, res) => {
  connection.query("DELETE FROM ingrediente WHERE ID_Ingrediente = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    res.json({ message: "Eliminado" });
  });
});

// ================= MENU =================
app.get("/api/menus", (req, res) => {
  connection.query("SELECT * FROM menu", (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    res.json(results);
  });
});
app.post("/api/menus", (req, res) => {
  const { fecha, CHEF_ID } = req.body;
  connection.query("INSERT INTO menu (fecha, CHEF_ID) VALUES (?,?)", [fecha, CHEF_ID], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    res.status(201).json({ id: result.insertId });
  });
});
app.put("/api/menus/:id", (req, res) => {
  const { fecha, CHEF_ID } = req.body;
  connection.query("UPDATE menu SET fecha=?, CHEF_ID=? WHERE ID_Menu = ?", [fecha, CHEF_ID, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    if (!result.affectedRows) return res.status(404).json({ error: "No encontrado" });
    res.json({ message: "Actualizado" });
  });
});
app.delete("/api/menus/:id", (req, res) => {
  connection.query("DELETE FROM menu WHERE ID_Menu = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    res.json({ message: "Eliminado" });
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

