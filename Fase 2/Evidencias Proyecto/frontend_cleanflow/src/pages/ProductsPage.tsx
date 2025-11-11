import React, { useState, useMemo } from 'react';
import { ProductsTemplate } from '../components/templates/ProductsTemplate';
import { ProductGrid } from '../components/organisms/ProductGrid';
import type { Product } from '../components/molecules/ProductCard';

// 1. Datos del Nav (simplificado, puedes inyectar los íconos si quieres)
// Nota: 'category' es una propiedad interna aquí, usamos 'name' para la UI.
const navLinks = [
    { name: 'Protección Femenina', category: 'PF', href: '/productos/proteccion-femenina' },
    { name: 'Higiene Personal', category: 'HP', href: '/productos/higiene-personal' },
    { name: 'Aseo del Hogar', category: 'AH', href: '/productos/aseo-del-hogar' },
    { name: 'Desinfección', category: 'DS', href: '/productos/desinfeccion' },
    { name: 'Higiene Empresas', category: 'HE', href: '/productos/higiene-empresas' },
    { name: 'Todos los Productos', category: 'ALL', href: '/productos/todos' },
];

// 2. Mockup de Datos de Productos
const allProducts: Product[] = [
    { id: 1, name: 'Toalla Sanitaria Noche', category: 'Protección Femenina', price: 5.99, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtsDeSHAU8jIu0ndLkgo6Uaj44hw8tEYdv4A&s' },
    { id: 2, name: 'Jabón Líquido PH Neutro', category: 'Higiene Personal', price: 3.50, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtsDeSHAU8jIu0ndLkgo6Uaj44hw8tEYdv4A&s' },
    { id: 3, name: 'Detergente Concentrado', category: 'Aseo del Hogar', price: 12.00, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtsDeSHAU8jIu0ndLkgo6Uaj44hw8tEYdv4A&s' },
    { id: 4, name: 'Alcohol Desinfectante 70%', category: 'Desinfección', price: 6.80, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtsDeSHAU8jIu0ndLkgo6Uaj44hw8tEYdv4A&s' },
    { id: 5, name: 'Limpiador Industrial Galón', category: 'Higiene Empresas', price: 25.00, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtsDeSHAU8jIu0ndLkgo6Uaj44hw8tEYdv4A&s' },
    { id: 6, name: 'Shampoo Acondicionador', category: 'Higiene Personal', price: 4.99, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtsDeSHAU8jIu0ndLkgo6Uaj44hw8tEYdv4A&s' },
    { id: 7, name: 'Lustrador de Muebles', category: 'Aseo del Hogar', price: 7.50, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtsDeSHAU8jIu0ndLkgo6Uaj44hw8tEYdv4A&s' },
    { id: 8, name: 'Toallitas Húmedas Desinfectantes', category: 'Desinfección', price: 4.20, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtsDeSHAU8jIu0ndLkgo6Uaj44hw8tEYdv4A&s' },
    { id: 9, name: 'Cera para Pisos', category: 'Higiene Empresas', price: 30.00, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtsDeSHAU8jIu0ndLkgo6Uaj44hw8tEYdv4A&s' },
];

// 3. Componente de la Página
export const ProductsPage: React.FC = () => {
    // Estado para guardar la categoría activa, inicializado en 'Todos los Productos'
    const [currentCategory, setCurrentCategory] = useState('Todos los Productos');

    // Función para manejar el cambio de categoría
    const handleCategoryChange = (categoryName: string) => {
        setCurrentCategory(categoryName);
        // Aquí podrías agregar lógica para cargar datos desde un API si no los tuvieras todos
    };

    // Lógica de filtrado: utiliza useMemo para optimizar y solo recalcular cuando cambie la categoría
    const filteredProducts = useMemo(() => {
        if (currentCategory === 'Todos los Productos') {
            return allProducts;
        }
        return allProducts.filter(product => product.category === currentCategory);
    }, [currentCategory]);

    // Modificamos los enlaces del nav para que contengan la lógica de cambio de estado (onClick)
    const categoryNavLinks = useMemo(() => {
        return navLinks.map(link => ({
            name: link.name,
            href: link.href,
            // ✅ AÑADIDO: La función de cambio de estado
            onClick: () => handleCategoryChange(link.name) 
        }));
    }, [navLinks]);


    return (
        <ProductsTemplate
            // 💡 CORRECCIÓN CLAVE: Usamos el array pre-construido que tiene la función onClick
            navLinks={categoryNavLinks}
            currentCategory={currentCategory}
        >
            {/* Pasamos los productos filtrados al Organismo */}
            <ProductGrid products={filteredProducts} category={currentCategory} />
        </ProductsTemplate>
    );
};