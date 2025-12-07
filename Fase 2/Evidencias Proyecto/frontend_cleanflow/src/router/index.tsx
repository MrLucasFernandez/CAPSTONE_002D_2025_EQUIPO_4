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
// Public - Brands
const BrandsPage = lazy(() => import("@/modules/brands/pages/BrandsPage"));

// Public Products
const ProductsAllPage = lazy(() =>
  import("@modules/products/pages/ProductsAllPage")
);
const ProductsByCategoryPage = lazy(() =>
  import("@modules/products/pages/ProductsByCategoryPage")
);
const ProductsByBrandPage = lazy(() =>
  import("@modules/products/pages/ProductsByBrandPage")
);
const ProductDetailPage = lazy(() =>
  import("@modules/products/pages/ProductDetailPage")
);

// Cart / Checkout / MercadoPago
const CheckoutPage = lazy(() => import('@/modules/mercadopago/pages/CheckoutPage'));
// now modularized under modules/mercadopago
const MercadoPagoSuccessPage = lazy(() => import('@/modules/mercadopago/pages/SuccessPage'));
const MercadoPagoFailurePage = lazy(() => import('@/modules/mercadopago/pages/FailurePage'));
const MercadoPagoPendingPage = lazy(() => import('@/modules/mercadopago/pages/PendingPage'));

// Admin layout
const AdminLayout = lazy(() =>
  import("@admin/layouts/AdminLayout")
);

// Admin Pages
const DashboardPage = lazy(() =>
  import("@admin/dashboard/pages/Dashboard")
);

// Admin - Users
const UsersPage = lazy(() =>
  import("@admin/users/pages/UsersPage")
);
const UserEditPage = lazy(() => import("@admin/users/pages/UserEditPage"));

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
// Admin - Brands (rename to avoid collision with public BrandsPage)
const AdminBrandsPage = lazy(() => import("@admin/brands/pages/BrandsPage.tsx"));
const CreateBrandPage = lazy(() => import("@admin/brands/pages/CreateBrandPage.tsx"));
const EditBrandPage = lazy(() => import("@admin/brands/pages/EditBrandPage.tsx"));
// Admin - Ventas Tienda (submódulo ventasTienda)
const BoletasPage = lazy(() => import("@admin/ventasTienda/boletas/pages/BoletasPage"));
const BoletaDetailPage = lazy(() => import("@admin/ventasTienda/boletas/pages/BoletaDetailPage"));
const VentasPage = lazy(() => import('@admin/ventasTienda/pages/VentasPage'));
const PagosPage = lazy(() => import('@admin/ventasTienda/pagos/pages/PagosPage'));

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

      // Marcas (público)
      { path: "marcas", element: withSuspense(<BrandsPage />) },

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
        path: "productos/marca/:idMarca",
        element: withSuspense(<ProductsByBrandPage />),
      },

      // Carrito / Checkout
      { path: 'carrito', element: withSuspense(<CheckoutPage />) },

      // MercadoPago callbacks (rutas nuevas bajo /mercadopago)
      { path: 'mercadopago/success', element: withSuspense(<MercadoPagoSuccessPage />) },
      { path: 'mercadopago/failure', element: withSuspense(<MercadoPagoFailurePage />) },
      { path: 'mercadopago/pending', element: withSuspense(<MercadoPagoPendingPage />) },
      // Detalle Producto
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
          {
            path: "usuarios/editar/:id",
            element: withSuspense(<UserEditPage />),
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
          // Marcas Admin
          {
            path: "marcas",
            element: withSuspense(<AdminBrandsPage />),
          },
          {
            path: "marcas/crear",
            element: withSuspense(<CreateBrandPage />),
          },
          {
            path: "marcas/:id/editar",
            element: withSuspense(<EditBrandPage />),
          },
          // Ventas Tienda - Boletas (submódulo ventasTienda)
          {
            path: "ventas",
            element: withSuspense(<VentasPage />),
          },
          {
            path: "ventas/boletas",
            element: withSuspense(<BoletasPage />),
          },
          {
            path: "ventas/pagos",
            element: withSuspense(<PagosPage />),
          },
          {
            path: "ventas/boletas/:id",
            element: withSuspense(<BoletaDetailPage />),
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
