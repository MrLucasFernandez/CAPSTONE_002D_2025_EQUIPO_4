import React from 'react';
import type { FC } from 'react';

// Tipos para las props del átomo Button
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Button: FC<ButtonProps> = ({ onClick, children, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 bg-black/50 text-white rounded-full transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white ${className}`}
    >
      {children}
    </button>
  );
};