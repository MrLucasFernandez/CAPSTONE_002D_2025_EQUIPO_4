import React, { useState } from 'react';
import { useCart } from '@modules/cart/context/CartContext';
import CartItem from '@components/molecules/CartItem/CartItem';
import { createPreference } from '@modules/mercadopago/api/mercadopagoService';
import { generarVenta } from '@modules/mercadopago/api/ventas';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useToast } from '@/components/ui/ToastContext';
import Spinner from '@/components/ui/Spinner';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { formatCLP } from '@/utils/currency';

export const CartSidebar: React.FC = () => {
  const { items, removeItem, updateQuantity, total, clear, sidebarOpen, closeSidebar } = useCart();
  const open = sidebarOpen;
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { addToast } = useToast();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      // Verificar sesión
      if (!isAuthenticated || !user) {
        addToast('Debes iniciar sesión para continuar con el pago.', 'warning');
        window.location.href = '/login';
        return;
      }

      // 1) Crear la venta/boleta en el backend
      const ventaPayload = {
        idUsuario: user.idUsuario,
        idBodega: 1, // TODO: permitir seleccionar bodega en UI
        metodoPago: 'Mercado Pago',
        productos: items.map((it) => ({ idProducto: Number(it.id), cantidad: it.quantity })),
      };

      const ventaRes = await generarVenta(ventaPayload);
      const idBoleta = ventaRes?.boleta?.idBoleta || ventaRes?.boleta?.id || ventaRes?.boleta;
      if (!idBoleta) {
        console.error('Respuesta inesperada al crear venta:', ventaRes);
        addToast('No se pudo crear la boleta en el servidor.', 'error');
        return;
      }

      // 2) Crear preferencia de MercadoPago usando el id de boleta real
      // Enviar además `idBodega` en el cuerpo para que el backend sepa la bodega asociada
      const idBodega = ventaPayload.idBodega;
      const res = await createPreference(String(idBoleta), idBodega);
      const redirect = res.init_point || res.sandbox_init_point || (res as any).redirectUrl;
      if (redirect) {
        window.location.href = redirect;
      } else {
        addToast('No se recibió URL de MercadoPago desde el backend.', 'error');
      }
    } catch (err) {
      console.error(err);
      const message = (err as Error)?.message || '';
      const isStockError = /stock|insuficiente|agotado|sin\s+stock|no\s+hay\s+stock/i.test(message) || message.includes('400');
      if (isStockError) {
        addToast('Stock insuficiente para uno o más productos. Ajusta las cantidades y vuelve a intentar.', 'error');
      } else {
        addToast('Error al iniciar el pago.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={`fixed top-4 bottom-4 right-0 max-h-[92vh] w-[92vw] sm:w-96 max-w-md bg-white text-slate-900 shadow-2xl rounded-l-2xl transform transition-transform ${open ? 'translate-x-0' : 'translate-x-full'} flex flex-col overflow-hidden`} style={{ zIndex: 9998 }}>
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="p-4 bg-black/60 rounded">
            <Spinner size={36} />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4 p-4 border-b">
        <div>
          <h3 className="text-lg font-semibold">Tu carrito</h3>
          <p className="text-sm text-gray-500">{items.length} {items.length === 1 ? 'artículo' : 'artículos'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => clear()} className="text-sm text-red-500 hover:underline">Vaciar</button>
          <button onClick={() => closeSidebar()} className="p-2 rounded-lg hover:bg-gray-100">
            <XMarkIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Items list */}
      <div className="p-3 flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <div className="mb-3">Tu carrito está vacío</div>
            <div className="text-sm">Agrega productos desde la página de catálogo.</div>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((it) => (
              <CartItem key={it.id} item={it} onRemove={removeItem} onChangeQuantity={updateQuantity} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-gradient-to-t from-white/60 to-transparent shrink-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">Total</span>
          <strong className="text-lg">{formatCLP(total)}</strong>
        </div>
        <button disabled={loading || items.length === 0} onClick={handleCheckout} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow">
          {loading ? 'Redirigiendo...' : 'Pagar'}
        </button>
      </div>
    </div>
  );
};

export default CartSidebar;
