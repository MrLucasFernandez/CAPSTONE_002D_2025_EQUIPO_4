// Importaciones principales de React Router
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Componentes base del sitio
import Navbar from "./components/Navbar";
import Carrusel from "./components/Carrusel";
import Acceso from "./components/Acceso";
import Cotiza from "./components/Cotiza";
import Footer from "./components/Footer";
import ListaProductos from "./components/ListaProductos";

// Carrito (panel + contexto global)
import PanelCarrito from "./components/PanelCarrito";
import { CarritoProveedor } from "./contextos/CarritoContexto";

// Componente simple para que no dé 404.
// Lo uso mientras preparo cada sección o filtro real.
function Placeholder({ titulo, descripcion }: { titulo: string; descripcion?: string }) {
  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: 24, paddingTop: 32 }}>
      <h1 style={{ marginTop: 0 }}>{titulo}</h1>
      <p style={{ opacity: 0.9 }}>
        {descripcion ??
          "Página en preparación. Aquí voy a renderizar productos filtrados por esta categoría cuando conecte la API."}
      </p>
    </main>
  );
}

export default function App() {
  return (
    // Envolviendo toda la app con el proveedor del carrito para compartir su estado
    <CarritoProveedor>
      <BrowserRouter>
        {/* Navbar siempre visible */}
        <Navbar />

        {/* Panel del carrito montado en toda la app (abre/cierra desde el contexto) */}
        <PanelCarrito />

        {/* Rutas principales */}
        <Routes>
          {/* Inicio */}
          <Route
            path="/"
            element={
              <>
                {/* Carrusel principal */}
                <Carrusel />

                {/* Sección principal: cards de muestra + paginación */}
                <main
                  style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "24px",
                    paddingTop: 32,
                  }}
                >
                  <ListaProductos />
                </main>

                {/* Footer visible en la home */}
                <Footer />
              </>
            }
          />

          {/* Acceso (login/registro) */}
          <Route path="/acceso" element={<Acceso />} />

          {/* Cotización para empresas/clientes */}
          <Route path="/cotiza" element={<Cotiza />} />

          {/* ====== Placeholders de categorías (evito 404) ====== */}
          {/* Nota: estas rutas luego mostrarán el mismo listado de productos
             pero con un filtro aplicado por categoría. */}
          <Route
            path="/productos"
            element={
              <Placeholder
                titulo="Productos"
                descripcion="Aquí voy a listar todos los productos. Más adelante agrego filtros por categoría, orden, búsqueda, etc."
              />
            }
          />
          <Route
            path="/proteccion-femenina"
            element={
              <Placeholder
                titulo="Protección Femenina"
                descripcion="Aquí voy a mostrar los productos filtrados por la categoría Protección Femenina."
              />
            }
          />
          <Route
            path="/aseo-hogar"
            element={
              <Placeholder
                titulo="Aseo Hogar"
                descripcion="Aquí voy a mostrar los productos de Aseo para el hogar."
              />
            }
          />
          <Route
            path="/higiene-personal"
            element={
              <Placeholder
                titulo="Higiene Personal"
                descripcion="Aquí voy a mostrar los productos de Higiene Personal."
              />
            }
          />
          <Route
            path="/desinfeccion"
            element={
              <Placeholder
                titulo="Desinfección"
                descripcion="Aquí voy a mostrar los productos de Desinfección."
              />
            }
          />
          <Route
            path="/higiene-empresas"
            element={
              <Placeholder
                titulo="Higiene Empresas"
                descripcion="Aquí voy a mostrar los productos orientados a empresas."
              />
            }
          />
          {/* ====== Fin placeholders ====== */}
        </Routes>
      </BrowserRouter>
    </CarritoProveedor>
  );
}
