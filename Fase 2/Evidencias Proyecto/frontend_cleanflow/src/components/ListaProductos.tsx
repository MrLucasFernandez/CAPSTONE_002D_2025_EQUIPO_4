import { useMemo, useState } from "react";
import "./ListaProductos.css";

// Nota: estas son “tarjetas de muestra” sólo para poblar la UI.
//       Cuando conecte la API, reemplazo este arreglo por datos reales.
const PLACEHOLDERS_TOTAL = 60; // invento 60 productos ficticios
const PAGE_SIZE = 6;           // muestro 6 por página (2 filas x 3 columnas)

export default function ListaProductos() {
  // Estado local de la página actual (arranco en la 1)
  const [pagina, setPagina] = useState(1);

  // Armo un arreglo de ids para simular productos vacíos
  const items = useMemo(
    () => Array.from({ length: PLACEHOLDERS_TOTAL }, (_, i) => ({ id: i + 1 })),
    []
  );

  // Calculo cuántas páginas tengo según el total y el tamaño de página
  const totalPaginas = Math.ceil(items.length / PAGE_SIZE);

  // Saco el “slice” que corresponde a la página actual
  const visibles = useMemo(() => {
    const start = (pagina - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, pagina]);

  // Cambio de página con límites (no dejo ir a < 1 o > totalPaginas)
  const irA = (p: number) => setPagina(Math.min(Math.max(1, p), totalPaginas));

  return (
    <section className="bloque-productos contenedor" aria-labelledby="tit-productos">
      <h2 id="tit-productos" className="titulo-seccion">NUESTROS PRODUCTOS</h2>

      {/* Rejilla 3x2 con tarjetas vacías tipo “wireframe” */}
      <div className="rejilla-productos">
        {visibles.map((it) => (
          <article key={it.id} className="tarjeta-vacia" aria-label={`Producto ${it.id}`}>
            <div className="tarjeta-vacia__media" aria-hidden="true">
              {/* Este cuadrante simula la imagen del producto */}
              <span className="media__icono" />
            </div>

            <div className="tarjeta-vacia__contenido">
              <h3 className="tarjeta-vacia__titulo">PRODUCTO</h3>
              <p className="tarjeta-vacia__texto">
                Texto de muestra para ocupar el espacio. Aquí irá una
                descripción breve cuando cargue datos reales.
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Paginación en español (Anterior / Siguiente) */}
      <nav className="paginacion" aria-label="Paginación de productos">
        <button
          className="paginacion__btn"
          onClick={() => irA(pagina - 1)}
          disabled={pagina === 1}
        >
          Anterior
        </button>

        {/* Muestro un pequeño rango de páginas: actual ±2 */}
        <ul className="paginacion__numeros">
          {Array.from({ length: totalPaginas }, (_, i) => i + 1)
            .filter(n => Math.abs(n - pagina) <= 2 || n === 1 || n === totalPaginas)
            .map((n, idx, arr) => {
              // Inserto puntitos si hay saltos grandes (1 … 10 … 20)
              const prev = arr[idx - 1];
              const needsDots = prev && n - prev > 1;
              return (
                <li key={n}>
                  {needsDots && <span className="paginacion__dots">…</span>}
                  <button
                    className={`paginacion__numero ${n === pagina ? "is-active" : ""}`}
                    onClick={() => irA(n)}
                    aria-current={n === pagina ? "page" : undefined}
                  >
                    {n}
                  </button>
                </li>
              );
            })}
        </ul>

        <button
          className="paginacion__btn"
          onClick={() => irA(pagina + 1)}
          disabled={pagina === totalPaginas}
        >
          Siguiente
        </button>
      </nav>
    </section>
  );
}
