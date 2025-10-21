// Mantengo el navbar con React Router y el contexto del carrito.
// Reemplazo el link de "Acceso" por un icono de usuario a /acceso.

import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useCarrito } from "../contextos/CarritoContexto";
import "./Navbar.css";

type NavItem = { label: string; to: string };

// Dejo exactamente las secciones del mockup (sin "Acceso" aquí).
const LINKS: NavItem[] = [
  { label: "PRODUCTOS", to: "/productos" },
  { label: "PROTECCIÓN FEMENINA", to: "/proteccion-femenina" },
  { label: "ASEO HOGAR", to: "/aseo-hogar" },
  { label: "HIGIENE PERSONAL", to: "/higiene-personal" },
  { label: "DESINFECCIÓN", to: "/desinfeccion" },
  { label: "HIGIENE EMPRESAS", to: "/higiene-empresas" },
  { label: "COTIZA CON NOSOTROS!", to: "/cotiza" },
];

export default function Navbar() {
  // Estado del menú en mobile
  const [open, setOpen] = useState(false);

  // Traigo del contexto: abrir el panel y el total para el badge
  const { abrirCarrito, totalItems } = useCarrito();

  return (
    <header className="nav">
      <div className="nav__inner">
        {/* Logo a inicio */}
        <Link
          className="brand"
          to="/"
          aria-label="Ir al inicio"
          onClick={() => setOpen(false)}
        >
          <span className="brand__logo" aria-hidden="true">
            <img src="/imagen-logo/logo4.png" alt="Logo Donde Don Gino" />
          </span>
          <span className="brand__text">Donde Don Gino</span>
        </Link>

        {/* Menú principal */}
        <nav
          id="primary-menu"
          className={`menu ${open ? "is-open" : ""}`}
          aria-label="Menú principal"
        >
          {LINKS.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              onClick={() => setOpen(false)}
              // Marco activo con "pill" como la imagen
              className={({ isActive }) =>
                `menu__link ${isActive ? "is-active" : ""}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Acciones: buscar, usuario (-> /acceso), carrito, burger */}
        <div className="actions">
          {/* Buscar: de momento decorativo */}
          <button className="iconbtn" aria-label="Buscar" title="Buscar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="7" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
            </svg>
          </button>

          {/* Usuario: reemplaza el texto Acceso y navega a /acceso */}
          <Link to="/acceso" className="iconbtn user" aria-label="Acceso" title="Acceso" onClick={() => setOpen(false)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {/* cabeza */}
              <circle cx="12" cy="8" r="3.2" strokeWidth="2" />
              {/* torso */}
              <path d="M5 19c1.5-3.2 5-4.5 7-4.5s5.5 1.3 7 4.5" strokeWidth="2" />
            </svg>
          </Link>

          {/* Carrito: abre el panel lateral y muestra badge con total */}
          <button
            className="iconbtn cart"
            aria-label="Carrito"
            title="Carrito"
            onClick={abrirCarrito}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="9" cy="21" r="1.5" />
              <circle cx="19" cy="21" r="1.5" />
              <path d="M2 3h3l3.6 12.1a2 2 0 0 0 2 1.4h7.4a2 2 0 0 0 2-1.6L22 7H6" strokeWidth="2" />
            </svg>
            {totalItems > 0 && <span className="badge-carrito">{totalItems}</span>}
          </button>

          {/* Burger para mobile */}
          <button
            className="burger"
            aria-label="Abrir menú"
            aria-controls="primary-menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="3" y1="6"  x2="21" y2="6"  strokeWidth="2" />
              <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" />
              <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
