const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de MySQL
const poolConfig = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'appuser',
  database: process.env.DB_NAME || 'cruddb',
  password: process.env.DB_PASSWORD || 'apppass123',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool;

const getPool = async () => {
  if (!pool) pool = await mysql.createPool(poolConfig);
  return pool;
};

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Inicializar base de datos (MySQL)
const initDB = async () => {
  try {
    const p = await getPool();
    await p.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);
    console.log('✅ Tabla productos creada o ya existe');
  } catch (err) {
    console.error('❌ Error al crear tabla:', err);
  }
};

// Esperar y ejecutar inicialización para dar tiempo a que MySQL arranque
const waitForDB = async (retries = 15, delayMs = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const p = await getPool();
      await p.query('SELECT 1');
      return true;
    } catch (err) {
      console.warn(`DB no lista, reintentando en ${delayMs}ms... (${i + 1}/${retries})`);
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  throw new Error('No fue posible conectar a la base de datos después de varios intentos');
};

const startServer = async () => {
  try {
    await waitForDB();
    await initDB();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error al iniciar la aplicación:', err);
    process.exit(1);
  }
};

// ========== RUTAS API ==========

// GET - Obtener todos los productos
app.get('/api/productos', async (req, res) => {
  try {
    const p = await getPool();
    const [rows] = await p.query('SELECT * FROM productos ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// GET - Obtener un producto por ID
app.get('/api/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const p = await getPool();
    const [rows] = await p.query('SELECT * FROM productos WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// POST - Crear un nuevo producto
app.post('/api/productos', async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock } = req.body;

    if (!nombre || precio === undefined || stock === undefined) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const p = await getPool();
    const [result] = await p.query(
      'INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)',
      [nombre, descripcion || '', precio, stock]
    );

    const insertedId = result.insertId;
    const [rows] = await p.query('SELECT * FROM productos WHERE id = ?', [insertedId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// PUT - Actualizar un producto
app.put('/api/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body;

    const p = await getPool();
    const [result] = await p.query(
      'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id = ?',
      [nombre, descripcion, precio, stock, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const [rows] = await p.query('SELECT * FROM productos WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// DELETE - Eliminar un producto
app.delete('/api/productos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const p = await getPool();
    const [rowsBefore] = await p.query('SELECT * FROM productos WHERE id = ?', [id]);
    if (rowsBefore.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const [result] = await p.query('DELETE FROM productos WHERE id = ?', [id]);

    res.json({ message: 'Producto eliminado correctamente', producto: rowsBefore[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Servir frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor (espera DB)
startServer();
