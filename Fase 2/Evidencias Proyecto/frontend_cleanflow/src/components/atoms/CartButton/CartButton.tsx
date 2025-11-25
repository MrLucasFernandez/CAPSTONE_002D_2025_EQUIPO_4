import React from 'react';

interface Props {
  count?: number;
  onClick?: () => void;
}

export const CartButton: React.FC<Props> = ({ count = 0, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick?.()}
      className="relative inline-flex items-center gap-2 px-3 py-1.5 bg-transparent text-white rounded-full border border-white/10 hover:bg-white/5 transition"
      aria-label="Abrir carrito"
    >
      {/* Minimal shopping bag icon */}
      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2h12v4H6z" />
        <path d="M3 6h18l-2 14H5L3 6z" />
        <path d="M9 10a3 3 0 0 1 6 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-2 -top-2 bg-amber-400 text-amber-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">{count}</span>
      )}
    </button>
  );
};

export default CartButton;
