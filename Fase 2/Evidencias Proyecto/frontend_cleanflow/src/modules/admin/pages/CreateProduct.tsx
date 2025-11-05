import { useState } from 'react';
import { ProductForm } from '../components/ProductForm'; 
import type { ProductFormData } from '../components/ProductForm';
// Asumiendo que ProductForm.tsx está en src/components

// Puedes necesitar un hook de navegación como useNavigate si usas react-router-dom
// import { useNavigate } from 'react-router-dom';

/**
 * Componente que encapsula la lógica para la creación de un nuevo producto.
 * * Este componente sería la página final renderizada en una ruta como '/admin/products/create'.
 */
export const CreateProduct = () => {
  // const navigate = useNavigate(); // Descomentar si usas navegación
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Maneja el envío de los datos del formulario.
   * Aquí es donde llamarías a tu API (por ejemplo, con Axios o Fetch)
   * para enviar los datos del nuevo producto.
   */
  const handleCreateProduct = (formData: ProductFormData) => {
    setIsSubmitting(true);
    console.log('📝 Datos del nuevo producto a enviar:', formData);

    // --- SIMULACIÓN DE LLAMADA A API ---
    // Simula una latencia de red de 2 segundos
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Simulación de éxito
      console.log('✅ Producto creado con éxito:', formData.nombreProducto);
      
      alert(`Producto "${formData.nombreProducto}" creado con éxito.`);
      
      // Después de crear, podrías redirigir al usuario a la lista de productos
      // navigate('/admin/products'); 
      
    }, 2000);
    // --- FIN SIMULACIÓN ---
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold leading-7 text-gray-900 mb-8">
        Crear Nuevo Producto
      </h1>
      
      <ProductForm
        // Para crear, no pasamos datos iniciales, por lo que queda en 'null' o 'undefined'.
        initialData={null} 
        onSubmit={handleCreateProduct}
        isSubmitting={isSubmitting}
      />
      
      {/* Opcional: Mostrar un mensaje de carga */}
      {isSubmitting && (
        <p className="mt-4 text-center text-indigo-600">
          Guardando la información del producto...
        </p>
      )}
    </div>
  );
};