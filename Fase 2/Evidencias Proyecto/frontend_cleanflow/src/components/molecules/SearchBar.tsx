import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

export const SearchBar = () => {
  const [query, setQuery] = useState('');

  // Manejador para el envío del formulario de búsqueda
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para manejar la búsqueda
    // por ejemplo, navegar a una página de resultados:
    // navigate(`/search?q=${query}`);
    console.log('Buscando:', query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xs">
      {/* Contenedor del ícono, posicionado absolutamente */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon 
          className="size-5 text-gray-400" 
          aria-hidden="true" 
        />
      </div>
      
      {/* Input de búsqueda */}
      <input
        id="search"
        name="search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar productos..."
        // Clases de Tailwind:
        // pl-10: Padding izquierdo para dejar espacio al ícono
        // bg-white: Fondo blanco para que contraste con tu navbar azul
        className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
      />
    </form>
  );
};