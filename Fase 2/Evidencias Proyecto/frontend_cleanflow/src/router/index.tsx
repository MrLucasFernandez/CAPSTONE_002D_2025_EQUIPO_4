import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../components/layouts/PublicLayout'; 
import { AdminLayout } from '../modules/admin/layouts/AdminLayout'; 

// Páginas Públicas
import HomePage from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
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
      { index: true, element: <HomePage /> }, 
      { path: 'login', element: <LoginPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  
  {
    // --- RUTAS DE ADMIN PROTEGIDAS ---
    path: '/admin',
    // 1. Elemento que verifica la autenticación
    element: <ProtectedAdminRoute />, 
    children: [
      {
        element: <AdminLayout />, 
        children: [
          // Páginas que se renderizan dentro del AdminLayout
          { index: true, element: <Dashboard /> }, // Ruta: /admin
          { path: 'productos', element: <ManageProducts /> }, // RUTA PARA LISTAR
          { path: 'productos/crear', element: <CreateProduct /> }, // RUTA PARA CREAR
          { path: 'productos/editar/:id', element: <EditProduct/> },
          { path: 'usuarios', element: <UsersPage />}, // RUTA PARA EDITAR
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