import { useCarrito } from "../contextos/CarritoContexto";
import "./PanelCarrito.css";

export default function PanelCarrito() {
  const { abierto, items, subtotal, cerrarCarrito, quitar, setCantidad, limpiar } = useCarrito();

  return (
    <aside className={`panel-carrito ${abierto ? "abierto" : ""}`} aria-label="Carrito de compras">
      <div className="panel-carrito__cabezal">
        <h3>Tu carrito</h3>
        <button className="btn-cerrar" onClick={cerrarCarrito} aria-label="Cerrar">×</button>
      </div>

      <div className="panel-carrito__lista">
        {items.length === 0 && <p className="vacio">Aún no tienes productos.</p>}

        {items.map((it) => (
          <article key={it.idProducto} className="carrito-item">
            <img className="carrito-item__img" src={it.imagen || "/placeholder.png"} alt={it.nombre} />
            <div className="carrito-item__info">
              <h4>{it.nombre}</h4>
              <p className="sku">{it.sku}</p>

              <div className="controles">
                <button onClick={() => setCantidad(it.idProducto, it.cantidad - 1)} aria-label="Quitar uno">−</button>
                <span className="cantidad">{it.cantidad}</span>
                <button onClick={() => setCantidad(it.idProducto, it.cantidad + 1)} aria-label="Agregar uno">+</button>
              </div>
            </div>

            <div className="carrito-item__precio">
              ${(it.precio * it.cantidad).toLocaleString("es-CL")}
              <button className="trash" onClick={() => quitar(it.idProducto)} aria-label="Eliminar">🗑️</button>
            </div>
          </article>
        ))}
      </div>

      <div className="panel-carrito__pie">
        <div className="subtotal">
          <span>Subtotal:</span>
          <strong>${subtotal.toLocaleString("es-CL")}</strong>
        </div>
        <div className="acciones">
          <button className="btn-secundario" onClick={cerrarCarrito}>Cerrar</button>
          <button className="btn-primario" onClick={() => alert("Continuar a checkout (próximo paso)")}>Continuar</button>
        </div>
        {items.length > 0 && (
          <button className="btn-limpiar" onClick={limpiar}>Vaciar carrito</button>
        )}
      </div>
    </aside>
  );
}
