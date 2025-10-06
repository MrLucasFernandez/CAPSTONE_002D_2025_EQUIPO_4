import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";

type NavItem = { label: string; to: string };

const LINKS: NavItem[] = [
  { label: "Inicio", to: "/" },
  { label: "Productos", to: "/productos" },
  { label: "Ofertas", to: "/ofertas" },
  { label: "Marcas", to: "/marcas" },
  { label: "Blog", to: "/blog" },
  { label: "Contacto", to: "/contacto" },
  { label: "Cotiza con nosotros!", to: "/cotiza" },
  { label: "Acceso", to: "/acceso" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="nav__inner">
        {/* Logo / marca */}
        <Link
          className="brand"
          to="/"
          aria-label="Ir al inicio"
          onClick={() => setOpen(false)}
        >
          <span className="brand__logo" aria-hidden="true">
            {/* Usa rutas desde /public */}
            <img src="/imagen-logo/logo-gino.jpg" alt="Logo Donde Don Gino" />
          </span>
          <span className="brand__text">Donde Don Gino</span>
        </Link>

        {/* Menú */}
        <nav
          id="primary-menu"
          className={`menu ${open ? "is-open" : ""}`}
          aria-label="Menú principal"
        >
          {LINKS.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              className={({ isActive }) =>
                `menu__link ${isActive ? "is-active" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Acciones derecha */}
        <div className="actions">
          <button className="iconbtn" aria-label="Buscar" title="Buscar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="7" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
            </svg>
          </button>

          <button className="iconbtn cart" aria-label="Carrito" title="Carrito">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="9" cy="21" r="1.5" />
              <circle cx="19" cy="21" r="1.5" />
              <path d="M2 3h3l3.6 12.1a2 2 0 0 0 2 1.4h7.4a2 2 0 0 0 2-1.6L22 7H6" strokeWidth="2" />
            </svg>
          </button>

          <button
            className="burger"
            aria-label="Abrir menú"
            aria-controls="primary-menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" />
              <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" />
              <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
