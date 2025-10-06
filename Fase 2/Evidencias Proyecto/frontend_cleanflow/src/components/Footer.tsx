import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="pie">
      <div className="pie__contenedor">
        {/* Marca + redes */}
        <div className="pie__col pie__col--marca">
          <img
            src="/imagen-logo/logo-gino.jpg"
            alt="Logo Donde Don Gino"
            className="pie__logo"
          />

          <div className="pie__redes" aria-label="Redes sociales">
            {/* Instagram */}
            <a className="pie__icono" href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5Zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5ZM18 6.2a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z"/>
              </svg>
            </a>
            {/* X / Twitter */}
            <a className="pie__icono" href="#" aria-label="X">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path fill="currentColor" d="M3 3h4.2l5.3 7.2L16.7 3H21l-7 9.3 7.6 8.7H17.4l-5.7-7.1-4.9 7.1H3l6.9-9.8L3 3Z"/>
              </svg>
            </a>
            {/* YouTube */}
            <a className="pie__icono" href="#" aria-label="YouTube">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path fill="currentColor" d="M23 12c0 2.1-.2 3.7-.4 4.6a3.2 3.2 0 0 1-2.3 2.3C19.3 19.1 12 19.1 12 19.1s-7.3 0-8.3-.2a3.2 3.2 0 0 1-2.3-2.3C1.2 15.7 1 14.1 1 12s.2-3.7.4-4.6A3.2 3.2 0 0 1 3.7 5C4.7 4.9 12 4.9 12 4.9s7.3 0 8.3.2a3.2 3.2 0 0 1 2.3 2.3c.2.9.4 2.5.4 4.6ZM10 8.8v6.5l6-3.2-6-3.3Z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a className="pie__icono" href="#" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5Zm.02 6.5H2v10h3V10ZM9 10H6v10h3v-5.4c0-2.9 3.6-3.2 3.6 0V20h3v-6.2c0-5.2-5.9-5-6.6-2.5V10Z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Columna 1 */}
        <div className="pie__col">
          <h3 className="pie__titulo">Categorías</h3>
          <ul className="pie__lista">
            <li><Link to="/productos">Aseo Hogar</Link></li>
            <li><Link to="/productos">Desinfección</Link></li>
            <li><Link to="/productos">Higiene Personal</Link></li>
            <li><Link to="/productos">Higiene Empresas</Link></li>
            <li><Link to="/productos">Protección Femenina</Link></li>
          </ul>
        </div>

        {/* Columna 2 */}
        <div className="pie__col">
          <h3 className="pie__titulo">Explora</h3>
          <ul className="pie__lista">
            <li><Link to="/marcas">Marcas</Link></li>
            <li><Link to="/ofertas">Ofertas</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/cotiza">Cotiza con nosotros</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>

        {/* Columna 3 */}
        <div className="pie__col">
          <h3 className="pie__titulo">Ayuda</h3>
          <ul className="pie__lista">
            <li><Link to="/contacto">Preguntas frecuentes</Link></li>
            <li><Link to="/contacto">Soporte</Link></li>
            <li><a href="#">Políticas de envío</a></li>
            <li><a href="#">Términos y condiciones</a></li>
          </ul>
        </div>
      </div>

      <div className="pie__base">
        <p>© {new Date().getFullYear()} Donde Don Gino — Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
