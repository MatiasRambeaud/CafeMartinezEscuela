const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const connection = require("./BD/database"); // Conexión a la base de datos MySQL

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Configurar multer para guardar imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../frontend/public/img");
    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generar nombre único para la imagen
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes (jpeg, jpg, png, gif, webp)"));
    }
  }
});

// Servir archivos estáticos de imágenes
app.use("/img", express.static(path.join(__dirname, "../frontend/public/img")));

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

  // Validar y convertir ID_Cargo a número, usar 5 (Cliente) por defecto si no se proporciona
  const idCargo = ID_Cargo ? parseInt(ID_Cargo, 10) : 5;
  
  // Verificar que el ID_Cargo existe en la tabla cargo
  connection.query("SELECT ID_Cargo FROM cargo WHERE ID_Cargo = ?", [idCargo], (err, results) => {
    if (err) {
      console.error("Error al verificar cargo:", err);
      return res.status(500).json({ error: "Error al validar cargo" });
    }
    
    if (!results || results.length === 0) {
      return res.status(400).json({ error: `El ID_Cargo ${idCargo} no existe en la tabla cargo` });
    }

  const sql = `
    INSERT INTO usuario 
    (Nombre, Apellido, Nacimiento, Sexo, Correo, Clave, ID_Cargo) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
      [nombre, apellido, nacimiento, sexo, correo, clave, idCargo],
    (err, result) => {
      if (err) {
        console.error("Error al insertar usuario:", err);
        return res.status(500).json({ error: err.sqlMessage || "Error al guardar usuario" });
      }
      res.status(201).json({ message: "Usuario guardado correctamente" });
    }
  );
  });
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
  connection.query(`
    SELECT a.*, 
           COALESCE(SUM(i.Stock), 0) as Stock_Total
    FROM almacen a
    LEFT JOIN ingrediente i ON a.ID_Almacen = i.ID_Almacen
    GROUP BY a.ID_Almacen, a.Nombre, a.Descripcion, a.Stock, a.ID_Usuario
    ORDER BY a.ID_Almacen
  `, (err, results) => {
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
  const { Nombre, Descripcion, ID_Usuario } = req.body;
  connection.query("INSERT INTO almacen (Nombre, Descripcion, ID_Usuario) VALUES (?,?,?)", [Nombre, Descripcion, ID_Usuario], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    res.status(201).json({ id: result.insertId });
  });
});
app.put("/api/almacenes/:id", (req, res) => {
  const { Nombre, Descripcion, ID_Usuario } = req.body;
  connection.query("UPDATE almacen SET Nombre=?, Descripcion=?, ID_Usuario=? WHERE ID_Almacen = ?", [Nombre, Descripcion, ID_Usuario, req.params.id], (err, result) => {
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
// Obtener comidas del menú activo
app.get("/api/comidas/menu-activo", (req, res) => {
  connection.query(
    `SELECT c.* FROM comida c 
     INNER JOIN menu m ON c.ID_Menu = m.ID_Menu 
     WHERE m.activo = 1 
     ORDER BY c.ID_Comida`,
    (err, results) => {
      if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
      res.json(results);
    }
  );
});
app.post("/api/comidas", upload.single("imagen"), (req, res) => {
  const { Nombre, Descripcion, ID_Menu, Precio } = req.body;
  const imagen = req.file ? `/img/${req.file.filename}` : null;
  const precio = Precio ? parseFloat(Precio) : 0;
  
  connection.query(
    "INSERT INTO comida (Nombre, Descripcion, ID_Menu, Imagen, Precio) VALUES (?,?,?,?,?)",
    [Nombre, Descripcion, ID_Menu, imagen, precio],
    (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    res.status(201).json({ id: result.insertId });
    }
  );
});
app.put("/api/comidas/:id", upload.single("imagen"), (req, res) => {
  const { Nombre, Descripcion, ID_Menu, Precio, Imagen } = req.body;
  const id = req.params.id;
  
  // Obtener datos actuales de la comida
  connection.query("SELECT Imagen FROM comida WHERE ID_Comida = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    if (results.length === 0) return res.status(404).json({ error: "No encontrado" });
    
    let imagenPath = Imagen || results[0].Imagen;
    
    // Si se subió una nueva imagen, usar esa
    if (req.file) {
      // Eliminar imagen anterior si existe
      if (results[0].Imagen) {
        const oldImagePath = path.join(__dirname, "../frontend/public", results[0].Imagen);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imagenPath = `/img/${req.file.filename}`;
    }
    
    const precio = Precio ? parseFloat(Precio) : 0;
    
    connection.query(
      "UPDATE comida SET Nombre=?, Descripcion=?, ID_Menu=?, Imagen=?, Precio=? WHERE ID_Comida = ?",
      [Nombre, Descripcion, ID_Menu, imagenPath, precio, id],
      (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    if (!result.affectedRows) return res.status(404).json({ error: "No encontrado" });
    res.json({ message: "Actualizado" });
      }
    );
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
  const { Metodo, Monto, ID_Usuario, ID_Pedido, Numero_Tarjeta, Nombre_Titular, Fecha_Vencimiento, CVV } = req.body;
  connection.query(
    `INSERT INTO compra (Metodo, Monto, ID_Usuario, ID_Pedido, Numero_Tarjeta, Nombre_Titular, Fecha_Vencimiento, CVV) 
     VALUES (?,?,?,?,?,?,?,?)`,
    [Metodo, Monto, ID_Usuario, ID_Pedido || null, Numero_Tarjeta || null, Nombre_Titular || null, Fecha_Vencimiento || null, CVV || null],
    (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    res.status(201).json({ id: result.insertId });
    }
  );
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
  const { Nombre, Descripcion, ID_Almacen, Stock } = req.body;
  const stockValue = Stock !== undefined ? Stock : 0;
  connection.query("INSERT INTO ingrediente (Nombre, Descripcion, ID_Almacen, Stock) VALUES (?,?,?,?)", [Nombre, Descripcion, ID_Almacen, stockValue], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    res.status(201).json({ id: result.insertId });
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
  const { fecha, CHEF_ID, activo } = req.body;
  const activoValue = activo ? 1 : 0;
  connection.query("INSERT INTO menu (fecha, CHEF_ID, activo) VALUES (?,?,?)", [fecha, CHEF_ID, activoValue], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    // Si este menú está activo, desactivar los demás
    if (activoValue === 1) {
      connection.query("UPDATE menu SET activo = 0 WHERE ID_Menu != ?", [result.insertId]);
    }
    res.status(201).json({ id: result.insertId });
  });
});
app.put("/api/menus/:id", (req, res) => {
  const { fecha, CHEF_ID, activo } = req.body;
  const id = req.params.id;
  const activoValue = activo ? 1 : 0;
  
  connection.query("UPDATE menu SET fecha=?, CHEF_ID=?, activo=? WHERE ID_Menu = ?", [fecha, CHEF_ID, activoValue, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    if (!result.affectedRows) return res.status(404).json({ error: "No encontrado" });
    // Si este menú está activo, desactivar los demás
    if (activoValue === 1) {
      connection.query("UPDATE menu SET activo = 0 WHERE ID_Menu != ?", [id]);
    }
    res.json({ message: "Actualizado" });
  });
});
// Endpoint para activar un menú (desactiva los demás automáticamente)
app.put("/api/menus/:id/activar", (req, res) => {
  const id = req.params.id;
  connection.query("UPDATE menu SET activo = 0", (err) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
    connection.query("UPDATE menu SET activo = 1 WHERE ID_Menu = ?", [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.sqlMessage || "Error" });
      if (!result.affectedRows) return res.status(404).json({ error: "No encontrado" });
      res.json({ message: "Menú activado" });
    });
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

// ================= PEDIDOS =================
// Crear un nuevo pedido
app.post("/api/pedidos", (req, res) => {
  const { ID_Usuario, total, productos } = req.body;

  if (!ID_Usuario || total === undefined) {
    return res.status(400).json({ error: "ID_Usuario y total son requeridos" });
  }

  // Convertir productos a JSON string
  const productosJSON = productos && productos.length > 0 ? JSON.stringify(productos) : null;

  const sql = `
    INSERT INTO pedido (ID_Usuario, total, estado, estado_cobro, productos) 
    VALUES (?, ?, 'pendiente', 'pendiente', ?)
  `;

  connection.query(sql, [ID_Usuario, total, productosJSON], (err, result) => {
    if (err) {
      console.error("Error al crear pedido:", err);
      return res.status(500).json({ error: err.sqlMessage || "Error al crear pedido" });
    }

    res.status(201).json({ 
      message: "Pedido creado correctamente",
      id: result.insertId 
    });
  });
});

// Obtener todos los pedidos
app.get("/api/pedidos", (req, res) => {
  connection.query(`
    SELECT p.*, u.Nombre as cliente_nombre, u.Apellido as cliente_apellido
    FROM pedido p
    LEFT JOIN usuario u ON p.ID_Usuario = u.ID_Usuario
    ORDER BY p.fecha DESC
  `, (err, results) => {
    if (err) {
      console.error("Error al obtener pedidos:", err);
      return res.status(500).json({ error: err.sqlMessage || "Error en la base de datos" });
    }
    
    // Parsear productos JSON de cada pedido
    const pedidosConProductos = results.map(pedido => {
      let productos = [];
      try {
        if (pedido.productos) {
          productos = JSON.parse(pedido.productos);
        }
      } catch (e) {
        console.error("Error al parsear productos:", e);
      }
      return {
        ...pedido,
        productos: productos
      };
    });

    res.json(pedidosConProductos);
  });
});

// Obtener pedidos completados (para recepcionista)
app.get("/api/pedidos/completados", (req, res) => {
  connection.query(`
    SELECT p.*, u.Nombre as cliente_nombre, u.Apellido as cliente_apellido
    FROM pedido p
    LEFT JOIN usuario u ON p.ID_Usuario = u.ID_Usuario
    WHERE p.estado = 'completado'
    ORDER BY p.fecha DESC
  `, (err, results) => {
    if (err) {
      console.error("Error al obtener pedidos completados:", err);
      return res.status(500).json({ error: err.sqlMessage || "Error en la base de datos" });
    }
    
    // Parsear productos JSON de cada pedido
    const pedidosConProductos = results.map(pedido => {
      let productos = [];
      try {
        if (pedido.productos) {
          productos = JSON.parse(pedido.productos);
        }
      } catch (e) {
        console.error("Error al parsear productos:", e);
      }
      return {
        ...pedido,
        productos: productos
      };
    });

    res.json(pedidosConProductos);
  });
});

// Obtener pedidos completados para el chef (para descontar stock)
app.get("/api/pedidos/completados-chef", (req, res) => {
  connection.query(`
    SELECT p.*, u.Nombre as cliente_nombre, u.Apellido as cliente_apellido
    FROM pedido p
    LEFT JOIN usuario u ON p.ID_Usuario = u.ID_Usuario
    WHERE p.estado = 'completado'
    ORDER BY p.fecha DESC
  `, (err, results) => {
    if (err) {
      console.error("Error al obtener pedidos completados:", err);
      return res.status(500).json({ error: err.sqlMessage || "Error en la base de datos" });
    }
    
    // Parsear productos JSON de cada pedido
    const pedidosConProductos = results.map(pedido => {
      let productos = [];
      try {
        if (pedido.productos) {
          productos = JSON.parse(pedido.productos);
        }
      } catch (e) {
        console.error("Error al parsear productos:", e);
      }
      return {
        ...pedido,
        productos: productos
      };
    });

    res.json(pedidosConProductos);
  });
});

// Actualizar estado de pedido
app.put("/api/pedidos/:id", (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  
  if (!estado || !["pendiente", "completado"].includes(estado)) {
    return res.status(400).json({ error: "Estado inválido" });
  }

  connection.query(
    "UPDATE pedido SET estado = ? WHERE ID_Pedido = ?",
    [estado, id],
    (err, result) => {
      if (err) {
        console.error("Error al actualizar pedido:", err);
        return res.status(500).json({ error: err.sqlMessage || "Error al actualizar pedido" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Pedido no encontrado" });
      }
      res.json({ message: "Pedido actualizado correctamente" });
    }
  );
});

// Marcar pedido como cobrado/pendiente
app.put("/api/pedidos/:id/cobro", (req, res) => {
  const { id } = req.params;
  const { estado_cobro, metodo_pago, datos_tarjeta } = req.body;
  
  if (!estado_cobro || !["cobrado", "pendiente"].includes(estado_cobro)) {
    return res.status(400).json({ error: "Estado de cobro inválido" });
  }

  // Obtener datos del pedido primero
  connection.query(
    "SELECT ID_Usuario, total FROM pedido WHERE ID_Pedido = ?",
    [id],
    (err, pedidoResults) => {
      if (err) {
        console.error("Error al obtener pedido:", err);
        return res.status(500).json({ error: err.sqlMessage || "Error al obtener pedido" });
      }
      
      if (pedidoResults.length === 0) {
        return res.status(404).json({ error: "Pedido no encontrado" });
      }

      const pedido = pedidoResults[0];

      // Si se marca como cobrado, crear registro de compra
      if (estado_cobro === "cobrado" && metodo_pago) {
        const metodo = metodo_pago === "tarjeta" ? "tarjeta" : "efectivo";
        let numeroTarjeta = null;
        let nombreTitular = null;
        let fechaVencimiento = null;
        let cvv = null;

        if (metodo === "tarjeta" && datos_tarjeta) {
          numeroTarjeta = datos_tarjeta.numero || null;
          nombreTitular = datos_tarjeta.titular || null;
          fechaVencimiento = datos_tarjeta.vencimiento || null;
          cvv = datos_tarjeta.cvv || null;
        }

        connection.query(
          `INSERT INTO compra (Metodo, Monto, ID_Usuario, ID_Pedido, Numero_Tarjeta, Nombre_Titular, Fecha_Vencimiento, CVV) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [metodo, pedido.total, pedido.ID_Usuario, id, numeroTarjeta, nombreTitular, fechaVencimiento, cvv],
          (errCompra) => {
            if (errCompra) {
              console.error("Error al crear compra:", errCompra);
              return res.status(500).json({ error: errCompra.sqlMessage || "Error al registrar compra" });
            }
          }
        );
      }

      // Actualizar estado de cobro del pedido
      connection.query(
        "UPDATE pedido SET estado_cobro = ? WHERE ID_Pedido = ?",
        [estado_cobro, id],
        (err, result) => {
          if (err) {
            console.error("Error al actualizar cobro:", err);
            return res.status(500).json({ error: err.sqlMessage || "Error al actualizar cobro" });
          }
          if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Pedido no encontrado" });
          }
          res.json({ message: "Cobro actualizado correctamente" });
        }
      );
    }
  );
});


// Actualizar ingrediente (para admin - puede actualizar todo incluyendo Stock)
app.put("/api/ingredientes/:id", (req, res) => {
  const { id } = req.params;
  const { Nombre, Descripcion, ID_Almacen, Stock } = req.body;
  
  // Si solo se está actualizando el Stock (desde Admin editando stock directamente)
  if (Stock !== undefined && Nombre === undefined && Descripcion === undefined && ID_Almacen === undefined) {
    connection.query(
      "UPDATE ingrediente SET Stock = ? WHERE ID_Ingrediente = ?",
      [Stock, id],
      (err, result) => {
        if (err) {
          console.error("Error al actualizar stock:", err);
          return res.status(500).json({ error: err.sqlMessage || "Error al actualizar stock" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Ingrediente no encontrado" });
        }
        res.json({ message: "Stock actualizado correctamente" });
      }
    );
  } else if (Nombre !== undefined || Descripcion !== undefined || ID_Almacen !== undefined) {
    // Actualización completa desde admin (puede incluir Stock también)
    const updates = [];
    const values = [];
    
    if (Nombre !== undefined) {
      updates.push("Nombre = ?");
      values.push(Nombre);
    }
    if (Descripcion !== undefined) {
      updates.push("Descripcion = ?");
      values.push(Descripcion);
    }
    if (ID_Almacen !== undefined) {
      updates.push("ID_Almacen = ?");
      values.push(ID_Almacen);
    }
    if (Stock !== undefined) {
      updates.push("Stock = ?");
      values.push(Stock);
    }
    
    values.push(id);
    
    connection.query(
      `UPDATE ingrediente SET ${updates.join(", ")} WHERE ID_Ingrediente = ?`,
      values,
      (err, result) => {
        if (err) {
          console.error("Error al actualizar ingrediente:", err);
          return res.status(500).json({ error: err.sqlMessage || "Error" });
        }
        if (!result.affectedRows) {
          return res.status(404).json({ error: "No encontrado" });
        }
        res.json({ message: "Actualizado" });
      }
    );
  } else {
    return res.status(400).json({ error: "No se proporcionaron campos para actualizar" });
  }
});

// Reducir stock de ingrediente (solo para chef - solo puede reducir)
app.put("/api/ingredientes/:id/reducir-stock", (req, res) => {
  const { id } = req.params;
  const { Stock: nuevoStock } = req.body;
  
  if (nuevoStock === undefined) {
    return res.status(400).json({ error: "Stock es requerido" });
  }

  // Obtener stock actual
  connection.query(
    "SELECT Stock FROM ingrediente WHERE ID_Ingrediente = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error al obtener stock actual:", err);
        return res.status(500).json({ error: "Error al obtener stock actual" });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: "Ingrediente no encontrado" });
      }

      const stockActual = parseInt(results[0].Stock || 0);
      
      // Validar que el nuevo stock sea menor o igual al actual
      if (nuevoStock > stockActual) {
        return res.status(400).json({ error: "Solo puedes reducir el stock, no aumentarlo" });
      }

      if (nuevoStock < 0) {
        return res.status(400).json({ error: "El stock no puede ser negativo" });
      }

      // Actualizar stock
      connection.query(
        "UPDATE ingrediente SET Stock = ? WHERE ID_Ingrediente = ?",
        [nuevoStock, id],
        (err, result) => {
          if (err) {
            console.error("Error al actualizar stock:", err);
            return res.status(500).json({ error: err.sqlMessage || "Error al actualizar stock" });
          }
          if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Ingrediente no encontrado" });
          }
          res.json({ message: "Stock reducido correctamente" });
        }
      );
    }
  );
});

// Avisar al admin sobre stock bajo
app.post("/api/ingredientes/:id/avisar-admin", (req, res) => {
  const { id } = req.params;
  // Simplemente confirmar que se recibió el aviso
  // El admin verá los ingredientes con stock bajo directamente
  res.json({ message: "Se ha avisado al administrador sobre el stock bajo" });
});

// Obtener ingredientes con stock bajo (para el admin)
app.get("/api/ingredientes/stock-bajo", (req, res) => {
  connection.query(
    `SELECT * FROM ingrediente WHERE Stock <= 10 ORDER BY Stock ASC`,
    (err, results) => {
      if (err) {
        console.error("Error al obtener ingredientes con stock bajo:", err);
        return res.status(500).json({ error: err.sqlMessage || "Error" });
      }
      res.json(results);
    }
  );
});


// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});

