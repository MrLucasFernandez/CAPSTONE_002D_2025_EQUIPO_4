import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ItemCarrito = {
  idProducto: number | string;
  nombre: string;
  precio: number;        // CLP
  imagen?: string;
  sku?: string;
  cantidad: number;
};

type CarritoCtx = {
  abierto: boolean;
  items: ItemCarrito[];
  subtotal: number;
  totalItems: number;
  abrirCarrito: () => void;
  cerrarCarrito: () => void;
  alternarCarrito: () => void;
  agregar: (item: Omit<ItemCarrito, "cantidad">, cantidad?: number) => void;
  quitar: (idProducto: ItemCarrito["idProducto"]) => void;
  setCantidad: (idProducto: ItemCarrito["idProducto"], cantidad: number) => void;
  limpiar: () => void;
};

const Ctx = createContext<CarritoCtx | null>(null);

export function CarritoProveedor({ children }: { children: React.ReactNode }) {
  const [abierto, setAbierto] = useState(false);
  const [items, setItems] = useState<ItemCarrito[]>(() => {
    try {
      const raw = localStorage.getItem("carrito-dondegino");
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("carrito-dondegino", JSON.stringify(items));
  }, [items]);

  const subtotal = useMemo(
    () => items.reduce((acc, it) => acc + it.precio * it.cantidad, 0),
    [items]
  );
  const totalItems = useMemo(
    () => items.reduce((acc, it) => acc + it.cantidad, 0),
    [items]
  );

  const abrirCarrito = () => setAbierto(true);
  const cerrarCarrito = () => setAbierto(false);
  const alternarCarrito = () => setAbierto(v => !v);

  const agregar: CarritoCtx["agregar"] = (item, cant = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(p => p.idProducto === item.idProducto);
      if (idx >= 0) {
        const copia = [...prev];
        copia[idx] = { ...copia[idx], cantidad: copia[idx].cantidad + cant };
        return copia;
      }
      return [...prev, { ...item, cantidad: cant }];
    });
    setAbierto(true);
  };

  const quitar: CarritoCtx["quitar"] = (idProducto) =>
    setItems(prev => prev.filter(p => p.idProducto !== idProducto));

  const setCantidad: CarritoCtx["setCantidad"] = (idProducto, cantidad) =>
    setItems(prev =>
      prev.map(p => (p.idProducto === idProducto ? { ...p, cantidad: Math.max(1, cantidad) } : p))
    );

  const limpiar = () => setItems([]);

  return (
    <Ctx.Provider
      value={{
        abierto, items, subtotal, totalItems,
        abrirCarrito, cerrarCarrito, alternarCarrito,
        agregar, quitar, setCantidad, limpiar
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de <CarritoProveedor>");
  return ctx;
}
