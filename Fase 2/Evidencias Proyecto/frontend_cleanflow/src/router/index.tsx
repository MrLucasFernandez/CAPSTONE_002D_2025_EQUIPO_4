import { createBrowserRouter } from 'react-router-dom';

// Layouts
// Asumiendo que PublicLayout está en src/components/organisms o fue renombrado
import { PublicLayout } from '../components/layouts/PublicLayout'; 
import { AdminLayout } from '../modules/admin/layouts/AdminLayout'; 

// Páginas Públicas
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ContactPage from '../pages/ContactPage';
import RegisterPage from '../pages/RegisterPage';

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
    // Todas las rutas aquí dentro usarán el PublicLayout
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> }, // index: true significa que es la ruta raíz '/'
      { path: 'login', element: <LoginPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'register', element: <RegisterPage /> },
      // Aquí puedes agregar otras rutas públicas como 'about', 'services', etc.
    ],
  },
  
  {
    // --- RUTAS DE ADMIN PROTEGIDAS ---
    path: '/admin',
    // 1. Elemento que verifica la autenticación
    element: <ProtectedAdminRoute />, 
    children: [
      {
        // 2. Elemento que proporciona la estructura (Layout) si el usuario está autenticado.
        // Esto resuelve el error "AdminLayout is declared but never read" (6133).
        element: <AdminLayout />, 
        children: [
          // 3. Páginas que se renderizan dentro del AdminLayout
          { index: true, element: <Dashboard /> }, // Ruta: /admin
          { path: 'productos', element: <ManageProducts /> }, // Ruta: /admin/products
          { path: 'productos/crear', element: <CreateProduct /> }, // Ruta: /admin/products/new
          { path: 'productos/editar/:id', element: <EditProduct/> },
          { path: 'usuarios', element: <UsersPage />}, // Placeholder para la ruta de edición
        ],
      },
    ],
  },
  
  {
    // --- RUTA 404 (Catch-all) ---
    // Esta ruta se activa si no coincide ninguna de las anteriores
    path: '*',
    element: <h1 className="text-center p-10 text-4xl">404 | Página No Encontrada</h1>,
  },
]);

export default router;