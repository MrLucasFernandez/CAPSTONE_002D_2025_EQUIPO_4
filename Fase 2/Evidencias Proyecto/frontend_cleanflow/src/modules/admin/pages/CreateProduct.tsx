import { useState } from 'react';
import { ProductForm } from '../components/ProductForm'; 
import type { ProductFormData } from '../components/ProductForm';

export const CreateProduct = () => {
  // const navigate = useNavigate(); // Descomentar si usas navegación
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateProduct = (formData: ProductFormData) => {
    setIsSubmitting(true);
    console.log('📝 Datos del nuevo producto a enviar:', formData);

    setTimeout(() => {
      setIsSubmitting(false);
      
      console.log('✅ Producto creado con éxito:', formData.nombreProducto);
      
      alert(`Producto "${formData.nombreProducto}" creado con éxito.`);
      
    }, 2000);
    // --- FIN SIMULACIÓN ---
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold leading-7 text-gray-900 mb-8">
        Crear Nuevo Producto
      </h1>
      
      <ProductForm
        initialData={null} 
        onSubmit={handleCreateProduct}
        isSubmitting={isSubmitting}
      />
      {/* Mostrar un mensaje de carga */}
      {isSubmitting && (
        <p className="mt-4 text-center text-indigo-600">
          Guardando la información del producto...
        </p>
      )}
    </div>
  );
};