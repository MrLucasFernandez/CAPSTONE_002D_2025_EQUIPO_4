// src/router/index.tsx
import { createBrowserRouter } from "react-router-dom";

// Layouts
import { PublicLayout } from "../components/layouts/PublicLayout";
import { AdminLayout } from "../modules/admin/layouts/AdminLayout";

// Public Pages
import HomePage from "../pages/HomePage";
import LoginPage from "../modules/auth/pages/LoginPage";
import ContactPage from "../pages/ContactPage";
import RegisterPage from "../modules/auth/pages/RegisterPage";
import CotizarPage from "../pages/CotizarPage";

// Public - Productos
import ProductsAllPage from "../modules/products/pages/ProductsAllPage";
import ProductsByCategoryPage from "../modules/products/pages/ProductsByCategoryPage";
import ProductDetailPage from "../modules/products/pages/ProductDetailPage";

// Admin Pages
import DashboardPage from "../modules/admin/pages/Dashboard";
import UsersPage from "../modules/admin/users/pages/UsersPage";

// Admin - Products CRUD
import ProductListPage from "../modules/admin/products/pages/ProductListPage";
import ProductCreatePage from "../modules/admin/products/pages/ProductCreatePage";
import ProductEditPage from "../modules/admin/products/pages/ProductEditPage";

// Protected route wrapper
import { ProtectedAdminRoute } from "./ProtectedAdminRoute";

const router = createBrowserRouter([
  // -----------------------------------------------------
  // PUBLIC ROUTES
  // -----------------------------------------------------
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "cotizar", element: <CotizarPage /> },

      // -------- PUBLIC PRODUCT ROUTES --------
      { path: "productos/todos", element: <ProductsAllPage /> },
      { path: "productos/categoria/:idCategoria", element: <ProductsByCategoryPage /> },
      { path: "productos/:idProducto", element: <ProductDetailPage /> },

      {
        path: "access-denied",
        element: (
          <h1 className="text-center p-10 text-4xl">
            🚫 Acceso Denegado
          </h1>
        ),
      },
    ],
  },

  // -----------------------------------------------------
  // ADMIN PROTECTED ROUTES
  // -----------------------------------------------------
  {
    path: "/admin",
    element: <ProtectedAdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },

          // --- USERS ---
          { path: "usuarios", element: <UsersPage /> },

          // --- PRODUCTS CRUD ---
          { path: "productos", element: <ProductListPage /> },
          { path: "productos/crear", element: <ProductCreatePage /> },
          { path: "productos/editar/:id", element: <ProductEditPage /> },
        ],
      },
    ],
  },

  // -----------------------------------------------------
  // 404
  // -----------------------------------------------------
  {
    path: "*",
    element: (
      <h1 className="text-center p-10 text-4xl">
        404 | Página No Encontrada
      </h1>
    ),
  },
]);

export default router;
