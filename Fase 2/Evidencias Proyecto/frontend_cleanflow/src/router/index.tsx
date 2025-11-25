// src/router/index.tsx
import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { PublicLayout } from "@components/layouts/PublicLayout";
import { ProtectedAdminRoute} from "./ProtectedAdminRoute";
import type { ReactElement } from "react";
// Util: Wrapper para lazy load
const withSuspense = (element: ReactElement) => (
  <Suspense fallback={<div className="p-10 text-center">Cargando...</div>}>
    {element}
  </Suspense>
);

/* -----------------------------------------------------
    |LAZY IMPORTS (code-splitting por módulos)
----------------------------------------------------- */

// Public Pages
const HomePage = lazy(() => import("@/pages/HomePage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const CotizarPage = lazy(() => import("@/pages/CotizarPage"));
const LoginPage = lazy(() => import("@modules/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@modules/auth/pages/RegisterPage"));

// Public Products
const ProductsAllPage = lazy(() =>
  import("@modules/products/pages/ProductsAllPage")
);
const ProductsByCategoryPage = lazy(() =>
  import("@modules/products/pages/ProductsByCategoryPage")
);
const ProductDetailPage = lazy(() =>
  import("@modules/products/pages/ProductDetailPage")
);

// Admin layout
const AdminLayout = lazy(() =>
  import("@admin/layouts/AdminLayout")
);

// Admin Pages
const DashboardPage = lazy(() =>
  import("@admin/pages/Dashboard")
);

// Admin - Users
const UsersPage = lazy(() =>
  import("@admin/users/pages/UsersPage")
);

// Admin - Products CRUD
const ProductListPage = lazy(() =>
  import("@admin/products/pages/ProductListPage")
);
const ProductCreatePage = lazy(() =>
  import("@admin/products/pages/ProductCreatePage")
);
const ProductEditPage = lazy(() =>
  import("@admin/products/pages/ProductEditPage")
);
// Admin - Categories
const CategoriesPage = lazy(() =>
  import("@admin/categories/pages/CategoriesPage")
);
const CreateCategoryPage = lazy(() =>
  import("@admin/categories/pages/CreateCategoryPage")
);
// Admin - Categories Edit
const EditCategoryPage = lazy(() => import("@admin/categories/pages/EditCategoryPage"));

/* -----------------------------------------------------
    ROUTER DEFINICIÓN
----------------------------------------------------- */

const router = createBrowserRouter([
  // --------------------------------------
  // PÚBLICO
  // --------------------------------------
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: withSuspense(<HomePage />) },

      { path: "login", element: withSuspense(<LoginPage />) },
      { path: "register", element: withSuspense(<RegisterPage />) },

      { path: "contact", element: withSuspense(<ContactPage />) },
      { path: "cotizar", element: withSuspense(<CotizarPage />) },

      // Productos
      {
        path: "productos/todos",
        element: withSuspense(<ProductsAllPage />),
      },
      {
        path: "productos/categoria/:idCategoria",
        element: withSuspense(<ProductsByCategoryPage />),
      },
      {
        path: "productos/:idProducto",
        element: withSuspense(<ProductDetailPage />),
      },

      // Acceso denegado
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

  // --------------------------------------
  // ADMIN (PROTEGIDO)
  // --------------------------------------
  {
    path: "/admin",
    element: <ProtectedAdminRoute />,
    children: [
      {
        element: withSuspense(<AdminLayout />),
        children: [
          { index: true, element: withSuspense(<DashboardPage />) },

          // Usuarios
          {
            path: "usuarios",
            element: withSuspense(<UsersPage />),
          },

          // Productos Admin
          {
            path: "productos",
            element: withSuspense(<ProductListPage />),
          },
          {
            path: "productos/crear",
            element: withSuspense(<ProductCreatePage />),
          },
          {
            path: "productos/editar/:id",
            element: withSuspense(<ProductEditPage />),
          },
          // Categorías Admin
          {
            path: "categorias",
            element: withSuspense(<CategoriesPage />),
          },
          {
            path: "categorias/crear",
            element: withSuspense(<CreateCategoryPage />),
          },
          {
            path: "categorias/:id/editar",
            element: withSuspense(<EditCategoryPage />),
          },
        ],
      },
    ],
  },

  // --------------------------------------
  // 404
  // --------------------------------------
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
