import React, { ReactNode } from 'react';
import { Product } from '../molecules/ProductCard';

// 🚨 MODIFICACIÓN: La interfaz NavLink necesita la función de acción
interface NavLink {
    name: string;
    // El href es opcional si usamos React Router o un onClick
    href?: string; 
    // 🚨 AÑADIDO: Función que se ejecutará al hacer clic en el link
    onClick: (categoryName: string) => void;
}

interface ProductsTemplateProps {
    // 🚨 MODIFICACIÓN: navLinks ahora usa la interfaz NavLink que incluye onClick
    navLinks: NavLink[]; 
    currentCategory: string;
    children: ReactNode; // Para el ProductGrid
}

export const ProductsTemplate: React.FC<ProductsTemplateProps> = ({ navLinks, currentCategory, children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Simulación del NavBar */}
            <nav className="bg-white shadow-md p-4 sticky top-0 z-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Catálogo de Productos</h1>
                <div className="flex flex-wrap gap-2 sm:gap-4">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            // Usamos onClick para manejar la acción, el href es opcional o '#'
                            href={link.href || '#'} 
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition duration-150 ${
                                // La lógica de estilo sigue siendo: link.name === currentCategory
                                link.name === currentCategory
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={(e) => {
                                e.preventDefault();
                                // 🚨 USO CLAVE: Llama a la función onClick proporcionada en el objeto link, 
                                // pasándole el nombre de la categoría para que la Page cambie el estado.
                                link.onClick(link.name); 
                            }}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>
                <p className="mt-3 text-sm text-gray-500">
                    Estás viendo: <span className="font-semibold text-indigo-600">{currentCategory}</span>
                </p>
            </nav>

            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};