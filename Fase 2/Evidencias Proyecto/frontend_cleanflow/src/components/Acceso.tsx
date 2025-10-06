import React from "react";
import "./acceso.css";

export default function Acceso() {
  // (de momento solo prevenimos el submit para que no recargue)
  const onSubmit = (e: React.FormEvent) => e.preventDefault();

  return (
    <main className="acceso contenedor" aria-label="Acceso de usuarios">
      {/* Columna izquierda: Ingresar */}
      <section className="acceso__columna">
        <h2 className="acceso__titulo">Ingresar</h2>

        <form className="tarjeta-formulario" onSubmit={onSubmit}>
          <label className="campo">
            <span className="campo__etiqueta">Correo</span>
            <input className="campo__entrada" type="email" placeholder="Correo" required />
          </label>

          <label className="campo">
            <span className="campo__etiqueta">Contraseña</span>
            <input className="campo__entrada" type="password" placeholder="Contraseña" required />
          </label>

          <button className="boton boton--oscuro" type="submit">Ingresar</button>
        </form>
      </section>

      {/* Separador vertical */}
      <div className="acceso__separador" aria-hidden="true" />

      {/* Columna derecha: Registro */}
      <section className="acceso__columna">
        <p className="acceso__subtexto">¿Aún no tienes cuenta?</p>
        <h2 className="acceso__titulo">Regístrate</h2>

        <form className="form-registro" onSubmit={onSubmit}>
          <label className="campo">
            <span className="campo__etiqueta">Correo</span>
            <input className="campo__entrada" type="email" placeholder="Correo" required />
          </label>

          <label className="campo">
            <span className="campo__etiqueta">Contraseña</span>
            <input className="campo__entrada" type="password" placeholder="Contraseña" required />
          </label>

          <label className="campo">
            <span className="campo__etiqueta">Repetir contraseña</span>
            <input className="campo__entrada" type="password" placeholder="Repetir contraseña" required />
          </label>

          <div className="fila-doble">
            <label className="campo">
              <span className="campo__etiqueta">Nombre</span>
              <input className="campo__entrada" type="text" placeholder="Nombre" required />
            </label>

            <label className="campo">
              <span className="campo__etiqueta">Apellido</span>
              <input className="campo__entrada" type="text" placeholder="Apellido" required />
            </label>
          </div>

          <label className="campo">
            <span className="campo__etiqueta">RUT</span>
            <input
              className="campo__entrada"
              type="text"
              placeholder="Rut"
              inputMode="text"
              pattern="^(\d{1,2}\.?\d{3}\.?\d{3}-?[\dkK])$"
              title="Formato chileno: 12.345.678-9"
              required
            />
          </label>

          <button className="boton boton--oscuro" type="submit">Crear Cuenta</button>
        </form>
      </section>
    </main>
  );
}
