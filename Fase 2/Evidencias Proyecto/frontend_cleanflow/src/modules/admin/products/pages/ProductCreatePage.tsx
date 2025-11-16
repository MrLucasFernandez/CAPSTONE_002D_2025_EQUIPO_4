import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductForm from "../components/ProductForm";
import { useAdminProducts } from "../hooks/useAdminProducts"; // Importamos el hook
import {
  fetchCategories,
  fetchBrands,
} from "../api/adminProductsService"; // Mantener solo las referencias

import type { Categoria, Marca } from "../../../../types/product";
import type { ProductCreateData } from "../validations/product.schema";

export default function ProductCreatePage() {
  const navigate = useNavigate();
  // Obtener la función de creación del hook
  const { createProduct } = useAdminProducts();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loadingRefs, setLoadingRefs] = useState(true);
  
  // Estado para mensajes de feedback (reemplaza alert)
  const [feedbackMessage, setFeedbackMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    async function loadRefs() {
      try {
        const categorias = await fetchCategories();
        const marcas = await fetchBrands();

        setCategorias(categorias);
        setMarcas(marcas);
      } catch (error) {
        console.error("Error cargando categorías o marcas", error);
        setFeedbackMessage({ 
            message: "No se pudieron cargar las categorías o marcas.", 
            type: 'error' 
        });
      } finally {
        setLoadingRefs(false);
      }
    }

    loadRefs();
  }, []);

  const handleCreate = async (formData: FormData) => {
    setFeedbackMessage(null); // Limpiar mensaje anterior
    try {
      // Usar la función del hook, que ya maneja el POST y actualiza el estado global
      await createProduct(formData); 
      setFeedbackMessage({ message: "Producto creado correctamente.", type: 'success' });
      
      // Navegar a la lista de productos después de un breve retraso para mostrar el mensaje
      setTimeout(() => {
          navigate("/admin/productos");
      }, 1500); 
      
    } catch (err) {
      // Captura el error lanzado por el hook y lo muestra en la UI
      const errorMessage = (err as Error).message || "Error desconocido al crear producto.";
      setFeedbackMessage({ message: errorMessage, type: 'error' });
    }
  };
    
  const initialFormValues: ProductCreateData = {
    nombreProducto: "",
    precioCompraProducto: 0,
    // Usamos 0 como valor inicial para forzar la selección en los <select>
    idCategoria: 0, 
    idMarca: 0,     
    descripcionProducto: "",
    sku: "",
    productoActivo: true,
    imagen: undefined, // undefined es un valor seguro para el input type="file"
    urlImagenProducto: null,
    publicIdImagen: null,
  };


  if (loadingRefs) {
    return (
        <div className="flex justify-center items-center p-6 min-h-screen">
            <p className="text-xl text-gray-600">Cargando datos de referencia...</p>
        </div>
    );
  }

  // Clases dinámicas para feedback
  const feedbackClasses = feedbackMessage?.type === 'error'
    ? 'bg-red-100 text-red-700 border-red-400'
    : 'bg-green-100 text-green-700 border-green-400';


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Crear Nuevo Producto</h1>

      {feedbackMessage && (
        <div className={`p-4 mb-6 rounded-lg border-l-4 font-medium ${feedbackClasses}`}>
          {feedbackMessage.message}
        </div>
      )}

      <ProductForm
        isEditing={false}
        categorias={categorias}
        marcas={marcas}
        onSubmit={handleCreate}
        // Usamos los valores iniciales tipados
        initialValues={initialFormValues} 
      />
    </div>
  );
}