import React, { useState } from "react";
import "./Cotiza.css";
import Footer from "./Footer"; // ✅ importa el componente

type FormData = {
  nombreContacto: string;
  nombreEmpresa: string;
  comuna: string;
  telefono: string;
  correo: string;
  mensaje: string;
};

export default function Cotiza() {
  const [enviando, setEnviando] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [datos, setDatos] = useState<FormData>({
    nombreContacto: "",
    nombreEmpresa: "",
    comuna: "",
    telefono: "",
    correo: "",
    mensaje: "",
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDatos((d) => ({ ...d, [name]: value }));
  };

  const validar = () => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo);
    const telOk = /^[0-9+\-\s]{7,}$/.test(datos.telefono);
    if (!emailOk) return "Ingresa un correo válido.";
    if (!telOk) return "Ingresa un teléfono válido.";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOk(null);
    setError(null);

    const msg = validar();
    if (msg) return setError(msg);

    setEnviando(true);
    try {
      console.log("Datos a enviar:", datos);
      setOk("¡Gracias! Recibimos tu solicitud y te contactaremos pronto.");
      setDatos({
        nombreContacto: "",
        nombreEmpresa: "",
        comuna: "",
        telefono: "",
        correo: "",
        mensaje: "",
      });
    } catch {
      setError("Ocurrió un problema al enviar. Intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <main className="cotiza contenedor" aria-label="Formulario de cotización">
        <h1 className="cotiza__titulo">
          ¡Queremos que formes parte de nuestra comunidad de Clientes!
        </h1>

        <form className="cotiza__formulario" onSubmit={onSubmit}>
          <label className="campo">
            <span className="campo__etiqueta">Nombre de contacto*</span>
            <input
              className="campo__entrada"
              type="text"
              name="nombreContacto"
              placeholder="Nombre de contacto"
              value={datos.nombreContacto}
              onChange={onChange}
              required
            />
          </label>

          <label className="campo">
            <span className="campo__etiqueta">Nombre persona natural o Empresa*</span>
            <input
              className="campo__entrada"
              type="text"
              name="nombreEmpresa"
              placeholder="Nombre persona natural o Empresa"
              value={datos.nombreEmpresa}
              onChange={onChange}
              required
            />
          </label>

          <label className="campo">
            <span className="campo__etiqueta">Comuna*</span>
            <input
              className="campo__entrada"
              type="text"
              name="comuna"
              placeholder="Comuna"
              value={datos.comuna}
              onChange={onChange}
              required
            />
          </label>

          <label className="campo">
            <span className="campo__etiqueta">Teléfono*</span>
            <input
              className="campo__entrada"
              type="tel"
              name="telefono"
              placeholder="Teléfono"
              value={datos.telefono}
              onChange={onChange}
              required
            />
          </label>

          <label className="campo">
            <span className="campo__etiqueta">Correo*</span>
            <input
              className="campo__entrada"
              type="email"
              name="correo"
              placeholder="Correo"
              value={datos.correo}
              onChange={onChange}
              required
            />
          </label>

          <label className="campo campo--texto">
            <span className="campo__etiqueta">¿En qué te ayudamos?*</span>
            <textarea
              className="campo__entrada"
              name="mensaje"
              placeholder="Cuéntanos qué necesitas…"
              rows={4}
              value={datos.mensaje}
              onChange={onChange}
              required
            />
          </label>

          {error && <p className="alerta alerta--error">{error}</p>}
          {ok && <p className="alerta alerta--ok">{ok}</p>}

          <button className="boton boton--oscuro" type="submit" disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </main>

      <Footer /> 
    </>
  );
}
