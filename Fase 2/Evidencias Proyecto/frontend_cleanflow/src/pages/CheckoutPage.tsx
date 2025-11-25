import React from 'react';
import { useCart } from '@/modules/cart/context/CartContext';
import CartButton from '@/components/atoms/CartButton/CartButton';

const Inner: React.FC = () => {
  const { items, addItem, total } = useCart();
  const formatCLP = (n: number) => `$${Math.round(n).toLocaleString('es-CL')} CLP`;

  // Demo: agregar un producto de muestra
  const addDemo = () => {
    addItem({ id: 'demo-1', title: 'Producto Demo', price: 9.99, quantity: 1 });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <p className="mb-4">Total actual: <strong>{formatCLP(total)}</strong></p>
      <div className="flex gap-2 mb-4">
        <CartButton count={items.reduce((s, i) => s + i.quantity, 0)} onClick={() => {
          // abrir sidebar mediante evento DOM simple (el sidebar tiene control local)
          const el = document.querySelector('#cart-sidebar-toggle') as HTMLButtonElement | null;
          if (el) el.click();
        }} />
        <button className="px-3 py-2 bg-gray-200 rounded" onClick={addDemo}>Agregar demo</button>
      </div>

      <p className="text-sm text-gray-600">Al hacer clic en "Pagar con MercadoPago" el sistema solicitará la creación de la preferencia al backend y redirigirá a MercadoPago.</p>

      {/* El sidebar se monta globalmente en `main.tsx`. */}
    </div>
  );
};

const CheckoutPage: React.FC = () => <Inner />;

export default CheckoutPage;
