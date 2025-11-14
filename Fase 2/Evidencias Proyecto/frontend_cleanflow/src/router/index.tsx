// src/router/index.tsx
import { createBrowserRouter} from 'react-router-dom';
import { PublicLayout } from '../components/layouts/PublicLayout';
import { AdminLayout } from '../modules/admin/layouts/AdminLayout';

// Páginas Públicas
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ContactPage from '../pages/ContactPage';
import RegisterPage from '../pages/RegisterPage';
//import ProductsPage from '../pages/ProductsPage'; // Importación necesaria

// Páginas de Admin
import Dashboard from '../modules/admin/pages/Dashboard';
//import ManageProducts from '../modules/admin/pages/ManageProducts';
//import CreateProduct from '../modules/admin/pages/CreateProduct';
//import EditProduct from '../modules/admin/pages/EditProduct';
import UsersPage from '../modules/admin/pages/UsersPage';

// Componente de Protección de Ruta
import { ProtectedAdminRoute } from './ProtectedAdminRoute';

const router = createBrowserRouter([
    {
        // --- RUTAS PÚBLICAS ---
        path: '/',
        element: <PublicLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'login', element: <LoginPage /> },
            { path: 'contact', element: <ContactPage /> },
            { path: 'register', element: <RegisterPage /> },
            {path: 'access-denied', element: <h1 className="text-center p-10 text-4xl">🚫 Acceso Denegado</h1>},
        //{ path: 'productos/:categorySlug', element: <ProductsPage /> }, // Ruta dinámica
        ],
    },

    {
        // --- RUTAS DE ADMIN PROTEGIDAS ---
        path: '/admin',
        element: <ProtectedAdminRoute />,
        children: [
        {
            element: <AdminLayout />, // Layout de admin
            children: [
            { index: true, element: <Dashboard /> },
            //{ path: 'productos', element: <ManageProducts /> },
            //{ path: 'productos/crear', element: <CreateProduct /> },
            //{ path: 'productos/editar/:id', element: <EditProduct /> },
            { path: 'usuarios', element: <UsersPage /> },
            ],
        },
    ],
},

{
    // --- 404 ---
    path: '*',
        element: (
        <h1 className="text-center p-10 text-4xl">
        404 | Página No Encontrada
        </h1>
        ),
    },
]);

export default router;
