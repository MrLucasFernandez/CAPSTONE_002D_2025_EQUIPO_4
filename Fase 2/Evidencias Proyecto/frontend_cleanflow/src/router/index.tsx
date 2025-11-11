import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../components/layouts/PublicLayout'; 
import { AdminLayout } from '../modules/admin/layouts/AdminLayout'; 

// Páginas Públicas
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ContactPage from '../pages/ContactPage';
import RegisterPage from '../pages/RegisterPage';
import { ProductsPage } from '../pages/ProductsPage'; // Importación necesaria

// Páginas de Admin
import Dashboard from '../modules/admin/pages/Dashboard';
import { ManageProducts } from '../modules/admin/pages/ManageProducts';
import { CreateProduct } from '../modules/admin/pages/CreateProduct'; 
import UsersPage from '../modules/admin/pages/UsersPage';
import { EditProduct } from '../modules/admin/pages/EditProduct';
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
            
            // RUTA DINÁMICA DE PRODUCTOS AGREGADA
            // Captura cualquier slug (ej: /productos/higiene-personal) y lo envía a ProductsPage.
            // La ProductsPage usará useParams para obtener el slug y filtrar.
            { path: 'productos/:categorySlug', element: <ProductsPage /> },
        ],
    },
    
    {
        // --- RUTAS DE ADMIN PROTEGIDAS ---
        path: '/admin',
        element: <ProtectedAdminRoute />, 
        children: [
            {
                element: <AdminLayout />, 
                children: [
                    { index: true, element: <Dashboard /> }, 
                    { path: 'productos', element: <ManageProducts /> }, 
                    { path: 'productos/crear', element: <CreateProduct /> }, 
                    { path: 'productos/editar/:id', element: <EditProduct/> },
                    { path: 'usuarios', element: <UsersPage />},
                ],
            },
        ],
    },
    
    {
        path: '*',
        element: <h1 className="text-center p-10 text-4xl">404 | Página No Encontrada</h1>,
    },
]);

export default router;