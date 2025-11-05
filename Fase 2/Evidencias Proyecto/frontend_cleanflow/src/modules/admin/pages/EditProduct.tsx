// Simulación de useParams, ajusta si usas un router diferente
import { useParams, useNavigate } from 'react-router-dom'; 

import { ProductForm, type ProductFormData } from '../components/ProductForm'; 
import { useProductMutation } from '../../../hooks/useProductMutation';
import { useProductDetails } from '../../../hooks/useProductDetails'; 

export const EditProduct = () => { 
    const { productId } = useParams(); 
    const navigate = useNavigate();
    
    // Asegura que el ID es un número o null si no existe
    const id = productId ? parseInt(productId, 10) : null; 

    // 2. Cargar los datos del producto existente
    const { product: initialData, isLoading: isLoadingDetails, error: errorDetails } = useProductDetails(id);
    
    // 3. Hook para la mutación (guardar)
    const { mutate, isLoading: isSubmitting, error: mutationError } = useProductMutation();

    const handleSubmit = async (formData: ProductFormData) => {
        console.log("Iniciando edición del producto con ID:", id);
        
        try {
            // 4. Llamar a la mutación con el ID del producto
            await mutate(formData, id || undefined);
            
            // 5. Manejo de éxito: Navegar a la lista de productos y mostrar un mensaje
            alert("Producto actualizado con éxito!"); // Usar un Toast o Modal real en producción
            navigate('/admin/products'); 

        } catch (e) {
            // El hook useProductMutation ya maneja el estado de error interno
            console.error("Error al guardar el producto:", e);
        }
    };

    // --- Estados de Carga y Error ---

    if (errorDetails) {
        return (
            <div className="p-8 bg-red-100 border border-red-400 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-red-700">Error de Carga</h1>
                <p className="mt-2 text-red-600">No se pudo cargar el producto con ID: {id}. {errorDetails}</p>
                <button 
                    onClick={() => navigate('/admin/products')}
                    className="mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
                >
                    Volver al listado
                </button>
            </div>
        );
    }
    
    if (isLoadingDetails) {
        return (
            <div className="p-8 text-center">
                <p className="text-xl text-indigo-600">Cargando detalles del producto...</p>
                <div className="mt-4 h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-4 bg-indigo-500 animate-pulse"></div>
                </div>
            </div>
        );
    }

    // Si el ID es válido pero no se encontraron datos
    if (id !== null && !initialData) {
        return (
            <div className="p-8 bg-yellow-100 border border-yellow-400 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-yellow-700">Producto No Encontrado</h1>
                <p className="mt-2 text-yellow-600">El producto con ID {id} no existe o fue eliminado.</p>
                <button 
                    onClick={() => navigate('/admin/products')}
                    className="mt-4 px-4 py-2 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-700 transition"
                >
                    Volver al listado
                </button>
            </div>
        );
    }

    // --- Renderizado del Formulario ---
    
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-2xl border border-gray-100">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">
                Editar Producto: {initialData?.nombreProducto || id}
            </h1>
            
            {/* Mostrar error de mutación */}
            {mutationError && (
                <div className="mb-4 p-3 text-sm text-white bg-red-500 rounded-md shadow-md">
                    Error al guardar: {mutationError}
                </div>
            )}
            
            <ProductForm 
                // Le pasamos los datos cargados para que se autocompleten
                initialData={initialData} 
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};
