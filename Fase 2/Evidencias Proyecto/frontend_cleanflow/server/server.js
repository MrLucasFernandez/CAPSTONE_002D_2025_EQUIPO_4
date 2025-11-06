import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import { request } from 'http';

const { Pool } = pg;
const app = express();
const PORT = 3001;

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

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

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null || token === 'undefined') { 
        return res.status(401).json({ message: "Acceso denegado. No se proporcionó token." });
    }
    next(); 
};

// ======================================================================
// RUTA: REGISTRO DE NUEVO USUARIO (POST /api/register)
// ======================================================================
app.post('/api/register', async (req, res) => {
    const { rut, nombreUsuario, apellidoUsuario, email, telefono, password } = req.body; 
    let client;
    const saltRounds = 10;
    
    const telefonoLimpioString = telefono ? telefono.replace(/[^\d]/g, '') : null;
    const telefonoNumero = telefonoLimpioString ? parseInt(telefonoLimpioString, 10) : null;
    
    console.log(`POST /api/register: Intentando registro para ${email}`);

    if (!rut || !nombreUsuario || !apellidoUsuario || !email || !telefono || !password || password.length < 8) {
        return res.status(400).json({ success: false, message: "Todos los campos son obligatorios y la contraseña debe tener al menos 8 caracteres." });
    }

    if (telefonoLimpioString && (telefonoNumero === null || isNaN(telefonoNumero))) {
        console.error(`ERROR: El número de teléfono limpio (${telefonoLimpioString}) no es un INTEGER válido.`);
        return res.status(400).json({ success: false, message: "El número de teléfono proporcionado no es un número entero válido (es demasiado largo para el sistema)." });
    }


    try {
        client = await pool.connect();
        await client.query('BEGIN'); 

        const checkUserQuery = 'SELECT idusuario FROM usuario WHERE correo = $1';
        const userExists = await client.query(checkUserQuery, [email]);

        if (userExists.rows.length > 0) {
            await client.query('ROLLBACK');
            console.log(`POST /api/register: Falló. El correo ${email} ya está registrado.`);
            return res.status(409).json({ success: false, message: "El correo electrónico ya se encuentra registrado." });
        }

        const hash = await bcrypt.hash(password, saltRounds);

        const insertUserQuery = `
            INSERT INTO usuario (rut, nombreusuario, apellidousuario, correo, telefono, contrasena)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING idusuario; 
        `;
        const newUserResult = await client.query(insertUserQuery, [
            rut, 
            nombreUsuario, 
            apellidoUsuario, 
            email, 
            telefonoNumero,
            hash
        ]);
        const newUserId = newUserResult.rows[0].idusuario;

        const defaultRoleId = 2;

        const insertRoleQuery = `
            INSERT INTO rol_usuario (idusuario, idrol)
            VALUES ($1, $2);
        `;
        await client.query(insertRoleQuery, [newUserId, defaultRoleId]);
        
        await client.query('COMMIT'); 

        console.log(`POST /api/register: Usuario ${email} registrado con éxito con ID ${newUserId}.`);
        
        res.status(201).json({ 
            success: true, 
            message: "Usuario registrado correctamente. Puedes iniciar sesión.", 
            idUsuario: newUserId,
            rolAsignado: defaultRoleId
        });

    } catch (err) {
        try {
            if (client) await client.query('ROLLBACK');
        } catch (rollbackErr) {
            console.error('Error durante el rollback:', rollbackErr);
        }

        console.error("Error crítico en /api/register:", err);
        res.status(500).json({ success: false, message: "Error interno del servidor al intentar registrar el usuario." });
    } finally {
        if (client) {
            client.release(); 
        }
    }
});
// ======================================================================

// ======================================================================
// RUTA: OBTENER TODAS LAS CATEGORÍAS (GET /api/categories)
// ======================================================================
app.get('/api/categories', async (req, res) => {
    let client;
    try {
        client = await pool.connect(); 
        console.log('GET /api/categories: Conexión exitosa.');
        
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

// ======================================================================
// RUTA: OBTENER TODAS LAS MARCAS (GET /api/brands)
// ======================================================================
app.get('/api/brands', async (req, res) => {
    let client;
    try {
        client = await pool.connect(); 
        console.log('GET /api/brands: Conexión exitosa.');
        
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

// ======================================================================
// RUTA: OBTENER TODOS LOS USUARIOS (GET /api/admin/users)
// ======================================================================
app.get('/api/admin/users', authenticateToken, async (req, res) => {
    let client;
    try {
        client = await pool.connect(); 
        console.log('GET /api/admin/users: Conexión exitosa. Token verificado.');
        
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

// ======================================================================
// RUTA: OBTENER TODOS LOS PRODUCTOS (ADMIN) (GET /api/admin/products)
// ======================================================================
app.get('/api/admin/products', authenticateToken, async (req, res) => {
    let client;
    try {
        client = await pool.connect(); 
        console.log('GET /api/admin/products: Conexión exitosa. Token verificado.');
        
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


// ======================================================================
// RUTA: OBTENER TODOS LOS PRODUCTOS PÚBLICA (GET /api/products)
// ======================================================================
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


// ======================================================================
// RUTA: LOGIN (POST /api/login)
// ======================================================================
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
            LEFT JOIN rol_usuario RU ON U.idusuario = RU.idusuario
            LEFT JOIN rol R ON RU.idrol = R.idrol
            WHERE U.correo = $1;
        `;
        const userResult = await client.query(query, [correo]);
        const user = userResult.rows[0]; 

        if (!user || !user.hash) {
            console.log(`POST /api/login: Usuario ${correo} no encontrado o contraseña no establecida.`);
            return res.status(401).json({ success: false, message: "Credenciales inválidas." });
        }
        
        const isPasswordValid = await bcrypt.compare(contrasena, user.hash);

        if (!isPasswordValid) {
            console.log(`POST /api/login: Contraseña inválida para ${correo}.`);
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
            console.error(`POST /api/login: El usuario ${correo} no tiene un rol asignado.`);
            // Si el login fue exitoso, pero el usuario no tiene rol, lo tratamos como inválido
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

// ======================================================================
// RUTA: VERIFICAR ADMIN POR CORREO (GET /api/users/:email)
// ======================================================================
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