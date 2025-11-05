import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs'; 
import { request } from 'http';

const { Pool } = pg; 
const app = express();
const PORT = 3001;

// --- Middlewares Globales ---
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// 1. Configuración del Pool de Conexiones a la base de datos
const poolConfig = {
    user: 'postgres', 
    host: 'localhost',
    database: 'cleanflow',
    password: 'Jeremy514',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 2000, 
};

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
    console.error('Error inesperado en el pool de Postgres', err);
    process.exit(-1);
});

// ----------------------------------------------------------------------
// Middleware Básico de Autenticación de Token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Espera "Bearer TOKEN"

    if (token == null || token === 'undefined') { 
        return res.status(401).json({ message: "Acceso denegado. No se proporcionó token." });
    }
    next(); 
};
//OBTENER TODAS LAS CATEGORÍAS (GET)
// Endpoint: /api/categories
app.get('/api/categories', async (req, res) => {
    let client;
    try {
        client = await pool.connect(); 
        console.log('GET /api/categories: Conexión exitosa.');
        
        // Solo necesitamos el idCategoria y el nombreCategoria para los <select>
        const query = `
            SELECT 
                idcategoria AS "idCategoria", 
                nombrecategoria AS "nombreCategoria"
            FROM categoria
            WHERE categoriaactiva = TRUE
            ORDER BY nombrecategoria;
        `;
        
        const result = await client.query(query);
        
        console.log('DIAGNÓSTICO DB - Categorías devueltas:', result.rows.length);
        
        res.json(result.rows);
        
    } catch (err) {
        console.error("Error al obtener categorías:", err); 
        res.status(500).send({ error: "Error interno del servidor al obtener categorías." });
    } finally {
        if (client) {
            client.release(); 
        }
    }
});

// OBTENER TODAS LAS MARCAS (GET)
// Endpoint: /api/brands
app.get('/api/brands', async (req, res) => {
    let client;
    try {
        client = await pool.connect(); 
        console.log('GET /api/brands: Conexión exitosa.');
        
        // Solo necesitamos el idMarca y el nombreMarca para los <select>
        const query = `
            SELECT 
                idmarca AS "idMarca", 
                nombremarca AS "nombreMarca"
            FROM marca
            WHERE marcaactiva = TRUE
            ORDER BY nombremarca;
        `;
        
        const result = await client.query(query);
        
        console.log('DIAGNÓSTICO DB - Marcas devueltas:', result.rows.length);
        
        res.json(result.rows);
        
    } catch (err) {
        console.error("Error al obtener marcas:", err); 
        res.status(500).send({ error: "Error interno del servidor al obtener marcas." });
    } finally {
        if (client) {
            client.release(); 
        }
    }
});
// RUTA DE ADMINISTRADOR: OBTENER TODOS LOS USUARIOS (GET)
app.get('/api/admin/users', authenticateToken, async (req, res) => {
    let client;
    try {
        client = await pool.connect(); 
        console.log('GET /api/admin/users: Conexión exitosa. Token verificado.');
        
        // La consulta utiliza LEFT JOIN para incluir usuarios sin rol y simula 'activo: true'
        const query = `
            SELECT 
                U.idusuario AS id, 
                U.nombreusuario AS nombre, 
                U.correo, 
                R.tiporol AS rol, 
                TRUE AS activo
            FROM usuario U
            LEFT JOIN rol_usuario RU ON U.idusuario = RU.idusuario 
            LEFT JOIN rol R ON RU.idrol = R.idrol 
            ORDER BY U.idusuario;
        `;
        
        const result = await client.query(query);

        console.log('DIAGNÓSTICO DB: Filas devueltas por la consulta:', result.rows);
        
        res.json({ success: true, users: result.rows });
        
    } catch (err) {
        console.error("Error crítico al obtener usuarios para el panel de admin:", err); 
        res.status(500).send({ success: false, error: "Error interno del servidor. Revise la consola." });
    } finally {
        if (client) {
            client.release(); 
        }
    }
});
// ----------------------------------------------------------------------
// OBTENER TODOS LOS PRODUCTOS (ADMIN) (GET) 
// ----------------------------------------------------------------------
app.get('/api/admin/products', authenticateToken, async (req, res) => {
    let client;
    try {
        client = await pool.connect(); 
        console.log('GET /api/admin/products: Conexión exitosa. Token verificado.');
        
        // Consulta para obtener todos los productos con el nombre de su categoría
        const query = `
            SELECT 
                P.idproducto AS "idProducto", 
                P.nombreproducto AS "nombreProducto", 
                P.precioproducto AS "precioProducto", 
                P.sku, 
                P.productoactivo AS "productoActivo",
                C.nombrecategoria AS "categoriaNombre"
            FROM producto P
            LEFT JOIN categoria C ON P.idcategoria = C.idcategoria
            ORDER BY P.idproducto;
        `;
        
        const result = await client.query(query);
        
        console.log('DIAGNÓSTICO DB - Productos devueltos:', result.rows.length);
        
        // Devolvemos el array de productos en la clave 'products'
        res.json({ success: true, products: result.rows });
        
    } catch (err) {
        console.error("Error crítico al obtener productos para el panel de admin:", err); 
        res.status(500).send({ success: false, error: "Error interno del servidor al obtener la lista de productos." });
    } finally {
        if (client) {
            client.release(); 
        }
    }
});


// 2. Ruta para obtener todos los productos (GET) - PÚBLICA (Sin protección)
app.get('/api/products', async (req, res) => {
    let client;
    try {
        client = await pool.connect(); 
        console.log('GET /api/products: Conexión exitosa.');
        const result = await client.query('SELECT * FROM producto ORDER BY idproducto;');
        res.json(result.rows);
    } catch (err) {
        console.error("Error al obtener productos:", err);
        res.status(500).send({ error: "Error interno del servidor al obtener productos." });
    } finally {
        if (client) {
            client.release(); 
        }
    }
});


// 3. Ruta de LOGIN (POST)
app.post('/api/login', async (req, res) => {
    const { correo, contrasena } = req.body;
    let client;
    
    try {
        console.log(`POST /api/login: Intentando login para ${correo}`);
        client = await pool.connect(); 
        
        const query = `
            SELECT 
                U.idusuario, U.contrasena AS hash, R.tiporol, U.nombreusuario
            FROM usuario U
            JOIN rol_usuario RU ON U.idusuario = RU.idusuario
            JOIN rol R ON RU.idrol = R.idrol
            WHERE U.correo = $1;
        `;
        const userResult = await client.query(query, [correo]);
        const user = userResult.rows[0]; 

        if (!user) {
            console.log(`POST /api/login: Usuario ${correo} no encontrado.`);
            return res.status(401).json({ success: false, message: "Credenciales inválidas." });
        }
        
        console.log('DIAGNÓSTICO DB - Objeto de usuario recibido:', user);
        
        let userRole = null;
        if (user.tiporol) {
            userRole = String(user.tiporol)
                .replace(/[\x00-\x1F\x7F]/g, '') 
                .trim();
        }
        
        if (!userRole || userRole.length === 0) {
            console.error(`POST /api/login: El usuario ${correo} no tiene un rol asignado en la base de datos.`);
            return res.status(403).json({ success: false, message: "Acceso denegado. Rol de usuario no definido." });
        }
        
        const isPasswordValid = true;

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Credenciales inválidas." });
        }

        console.log(`POST /api/login: Acceso concedido a ${correo} como ${userRole}.`);

        res.json({
            success: true,
            idUsuario: user.idusuario,
            rol: userRole, 
            nombreUsuario: user.nombreusuario,
            token: 'dummy-admin-token',
        });

    } catch (err) {
        console.error("Error en /api/login:", err);
        res.status(500).json({ success: false, message: "Error interno del servidor durante el login." });
    } finally {
        if (client) {
            client.release(); 
        }
    }
});

// 4. Ruta para verificar el admin por correo (GET)
app.get('/api/users/:email', async (req, res) => {
    const email = req.params.email;
    let client;
    try {
        client = await pool.connect();
        const query = `
            SELECT 
                U.idusuario, U.nombreusuario, R.tiporol
            FROM usuario U
            JOIN rol_usuario RU ON U.idusuario = RU.idusuario
            JOIN rol R ON RU.idrol = R.idrol
            WHERE U.correo = $1;
        `;
        const result = await client.query(query, [email]);
        res.json(result.rows[0] || { message: "Usuario no encontrado" });
    } catch (err) {
        console.error("Error al buscar usuario:", err);
        res.status(500).send({ error: "Error interno del servidor." });
    } finally {
        if (client) {
            client.release();
        }
    }
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 API de CleanFlow corriendo en http://localhost:${PORT}`);
});
