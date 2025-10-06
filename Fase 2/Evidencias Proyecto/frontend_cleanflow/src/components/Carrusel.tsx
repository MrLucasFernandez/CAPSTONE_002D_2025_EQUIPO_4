import { useEffect, useState } from "react";
import "./Carrusel.css";

// lista de imágenes en el carrusel
const IMAGENES = [
  "/imagenes-carrusel/imagen-1-carrusel.png",
  "/imagenes-carrusel/imagen-2-carrusel.png",
];

export default function Carrusel() {
  const [indice, setIndice] = useState(0);

  const anterior = () => setIndice((i) => (i - 1 + IMAGENES.length) % IMAGENES.length);
  const siguiente = () => setIndice((i) => (i + 1) % IMAGENES.length);
  const irA = (i: number) => setIndice(i);

  // autoplay cada 5 segundos
  useEffect(() => {
    const id = setInterval(() => setIndice((i) => (i + 1) % IMAGENES.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="carrusel" aria-label="Promociones">
      <div className="carrusel__visor">
        <div
          className="carrusel__pista"
          style={{ transform: `translateX(-${indice * 100}%)` }}
        >
          {IMAGENES.map((src, i) => (
            <div className="carrusel__diapositiva" key={src} aria-hidden={i !== indice}>
              <img src={src} alt={`Banner ${i + 1}`} />
            </div>
          ))}
        </div>

        {/* botones */}
        <button className="carrusel__boton anterior" onClick={anterior}>‹</button>
        <button className="carrusel__boton siguiente" onClick={siguiente}>›</button>

        {/* indicadores */}
        <div className="carrusel__puntos">
          {IMAGENES.map((_, i) => (
            <button
              key={i}
              className={`punto ${i === indice ? "activo" : ""}`}
              onClick={() => irA(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
