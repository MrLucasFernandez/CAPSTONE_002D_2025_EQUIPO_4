import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Carrusel from "./components/Carrusel";
import Acceso from "./components/Acceso";
import Cotiza from "./components/Cotiza";
import Footer from "./components/Footer"; 

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Página de inicio */}
        <Route
          path="/"
          element={
            <>
              <Carrusel />
              <main
                style={{
                  maxWidth: 1200,
                  margin: "0 auto",
                  padding: "24px",
                  paddingTop: 32,
                }}
              >
                <h1>NUESTROS PRODUCTOS</h1>
                <p>Aquí irán las tarjetas de productos…</p>
                
              </main>
              <Footer />
            </>
          }
        />

        {/* Página de inicio de sesión / registro */}
        <Route path="/acceso" element={<Acceso />} />

        {/* Página de cotización */}
        <Route path="/cotiza" element={<Cotiza />} />
      </Routes>
    </BrowserRouter>
  );
}
