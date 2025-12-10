import React from 'react';
import type { CartItem as ICartItem } from '@/modules/cart/context/CartContext';
import { formatCLP } from '@/utils/currency';

interface Props {
  item: ICartItem;
  onRemove?: (id: string) => void;
  onChangeQuantity?: (id: string, q: number) => void;
}

export const CartItem: React.FC<Props> = ({ item, onRemove, onChangeQuantity }) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
      {item.image ? (
        <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-md" />
      ) : (
        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">Img</div>
      )}

      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{item.title}</div>
        <div className="text-sm text-gray-500">{formatCLP(item.price)}</div>

        <div className="mt-2 flex items-center gap-2">
          <button
            aria-label="Disminuir"
            onClick={() => onChangeQuantity && onChangeQuantity(item.id, Math.max(1, item.quantity - 1))}
            className="w-7 h-7 flex items-center justify-center rounded-md border text-gray-600"
          >-
          </button>
          <div className="px-2 text-sm">{item.quantity}</div>
          <button
            aria-label="Aumentar"
            onClick={() => onChangeQuantity && onChangeQuantity(item.id, item.quantity + 1)}
            className="w-7 h-7 flex items-center justify-center rounded-md border text-gray-600"
          >+
          </button>
          <button onClick={() => onRemove && onRemove(item.id)} className="ml-3 text-sm text-red-500">Eliminar</button>
        </div>
      </div>

      <div className="font-semibold text-sm">{formatCLP(item.price * item.quantity)}</div>
    </div>
  );
};

export default CartItem;
