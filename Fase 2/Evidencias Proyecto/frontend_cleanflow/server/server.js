import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import { request } from 'http';

const { Pool } = pg;
const app = express();
// Nota: En Render, el puerto se asigna por una variable de entorno, pero se mantiene para desarrollo local.
const PORT = 3001; 

app.use(cors({
    // IMPORTANTE: Cuando despliegues el frontend a producción, debes actualizar este 'origin'
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// CONFIGURACIÓN DEL POOL (Asegúrate de que esta configuración se ajuste a las variables de entorno de Render)
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
    // NOTA: Aquí falta la lógica para verificar el JWT (jwt.verify)
    next(); 
};

// ======================================================================
// RUTA: REGISTRO DE NUEVO USUARIO (POST /api/auth/register)
// 💡 CORRECCIÓN DEL 404: Cambiado de /api/register a /api/auth/register
// 💡 ACTUALIZACIÓN DB: Añadida direccionUsuario
// ======================================================================
app.post('/api/auth/register', async (req, res) => {
    const { rut, nombreUsuario, apellidoUsuario, correo, telefono, contrasena, direccionUsuario } = req.body; 
    let client;
    const saltRounds = 10;
    
    // El frontend ya usa 'correo' y 'contrasena', por lo que ajustamos la desestructuración.
    
    const telefonoLimpioString = telefono ? telefono.replace(/[^\d]/g, '') : null;
    const telefonoNumero = telefonoLimpioString ? parseInt(telefonoLimpioString, 10) : null;
    
    console.log(`POST /api/auth/register: Intentando registro para ${correo}`);

    if (!rut || !nombreUsuario || !apellidoUsuario || !correo || !telefono || !contrasena || contrasena.length < 8 || !direccionUsuario) {
        return res.status(400).json({ success: false, message: "Todos los campos (incluyendo la dirección) son obligatorios y la contraseña debe tener al menos 8 caracteres." });
    }

    if (telefonoLimpioString && (telefonoNumero === null || isNaN(telefonoNumero))) {
        console.error(`ERROR: El número de teléfono limpio (${telefonoLimpioString}) no es un INTEGER válido.`);
        return res.status(400).json({ success: false, message: "El número de teléfono proporcionado no es un número entero válido." });
    }


    try {
        client = await pool.connect();
        await client.query('BEGIN'); 

        const checkUserQuery = 'SELECT idusuario FROM usuario WHERE correo = $1 OR rut = $2';
        const userExists = await client.query(checkUserQuery, [correo, rut]);

        if (userExists.rows.length > 0) {
            await client.query('ROLLBACK');
            console.log(`POST /api/auth/register: Falló. El correo/rut ya existe.`);
            return res.status(409).json({ success: false, message: "El correo electrónico o RUT ya se encuentran registrados." });
        }

        const hash = await bcrypt.hash(contrasena, saltRounds);

        const insertUserQuery = `
            INSERT INTO usuario (rut, nombreusuario, apellidousuario, correo, telefono, direccionusuario, contrasena)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING idusuario, nombreusuario, correo; 
        `;
        const newUserResult = await client.query(insertUserQuery, [
            rut, 
            nombreUsuario, 
            apellidoUsuario, 
            correo, 
            telefonoNumero,
            direccionUsuario, // 💡 NUEVO CAMPO DE DIRECCIÓN
            hash
        ]);
        const newUserId = newUserResult.rows[0].idusuario;
        // const newUserName = newUserResult.rows[0].nombreusuario;
        
        // Asignar rol de cliente (2) por defecto
        const defaultRoleId = 2; 

        const insertRoleQuery = `
            INSERT INTO rol_usuario (idusuario, idrol)
            VALUES ($1, $2);
        `;
        await client.query(insertRoleQuery, [newUserId, defaultRoleId]);
        
        await client.query('COMMIT'); 

        console.log(`POST /api/auth/register: Usuario ${correo} registrado con éxito con ID ${newUserId}.`);
        
        // NOTA: En un sistema real, aquí generarías y devolverías un JWT
        res.status(201).json({ 
            success: true, 
            message: "Usuario registrado correctamente.", 
            // Devuelves los datos necesarios para iniciar sesión automáticamente
            token: 'dummy-token-registro', 
            user: {
                idUsuario: newUserId,
                nombreUsuario: newUserResult.rows[0].nombreusuario,
                rol: "Cliente" // Asumimos que el rol 2 es Cliente
            }
        });

    } catch (err) {
        try {
            if (client) await client.query('ROLLBACK');
        } catch (rollbackErr) {
            console.error('Error durante el rollback:', rollbackErr);
        }

        console.error("Error crítico en /api/auth/register:", err);
        // NOTA: Si es un error de unique (rut o correo), el código 409 lo cubre arriba.
        res.status(500).json({ success: false, message: "Error interno del servidor al intentar registrar el usuario." });
    } finally {
        if (client) {
            client.release(); 
        }
    }
});
// ======================================================================

// ======================================================================
// RUTA: LOGIN (POST /api/auth/login)
// 💡 CORRECCIÓN DEL 404: Cambiado de /api/login a /api/auth/login
// ======================================================================
app.post('/api/auth/login', async (req, res) => {
    const { correo, contrasena } = req.body;
    let client;
    
    try {
        console.log(`POST /api/auth/login: Intentando login para ${correo}`);
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
            console.log(`POST /api/auth/login: Usuario ${correo} no encontrado.`);
            return res.status(401).json({ success: false, message: "Credenciales inválidas." });
        }
        
        const isPasswordValid = await bcrypt.compare(contrasena, user.hash);

        if (!isPasswordValid) {
            console.log(`POST /api/auth/login: Contraseña inválida para ${correo}.`);
            return res.status(401).json({ success: false, message: "Credenciales inválidas." });
        }
        
        let userRole = null;
        if (user.tiporol) {
            userRole = String(user.tiporol).trim();
        }
        
        if (!userRole || userRole.length === 0) {
            console.error(`POST /api/auth/login: El usuario ${correo} no tiene un rol asignado.`);
            return res.status(401).json({ success: false, message: "Credenciales inválidas." });
        }
        
        console.log(`POST /api/auth/login: Acceso concedido a ${correo} como ${userRole}.`);

        res.json({
            success: true,
            idUsuario: user.idusuario,
            rol: userRole, 
            nombreUsuario: user.nombreusuario,
            token: 'dummy-admin-token',
            // Agrega más datos de usuario aquí si los necesitas en el frontend
        });

    } catch (err) {
        console.error("Error en /api/auth/login:", err);
        res.status(500).json({ success: false, message: "Error interno del servidor durante el login." });
    } finally {
        if (client) {
            client.release(); 
        }
    }
});
// ======================================================================


// Mantener el resto de las rutas GET /api/categories, /api/brands, /api/admin/users, /api/admin/products, /api/products, /api/users/:email sin cambios...


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 API de CleanFlow corriendo en http://localhost:${PORT}`);
});