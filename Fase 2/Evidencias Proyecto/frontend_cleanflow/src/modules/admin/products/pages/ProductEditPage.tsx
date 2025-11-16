import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ProductForm from "../components/ProductForm";
import { useAdminProducts } from "../hooks/useAdminProducts"; // Importar hook
import {
  fetchCategories,
  fetchBrands,
} from "../api/adminProductsService"; // Mantener solo fetchCategories/Brands

import type { Categoria, Marca } from "../../../../types/product";
import type { FormFields } from "../components/ProductForm"; // Importar el tipo consolidado del formulario

export default function ProductEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const idProducto = Number(id); // ID a editar
  
  // Usar el hook para estado global del producto, carga y acciones
  const { 
    fetchProductById, 
    updateProduct, 
    product, 
    isLoading, 
    error: hookError 
  } = useAdminProducts(); 

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loadingRefs, setLoadingRefs] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // ----------------------------------------------------
  // 1. Cargar categorías y marcas (referencias)
  // ----------------------------------------------------
  const loadRefs = useCallback(async () => {
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
  }, []);

  // Effect 1: Cargar referencias
  useEffect(() => {
    loadRefs();
  }, [loadRefs]);

  // ----------------------------------------------------
  // 2. Cargar producto por ID
  // ----------------------------------------------------
  useEffect(() => {
    // Validar ID
    if (isNaN(idProducto) || idProducto <= 0) {
        setFeedbackMessage({ message: "ID de producto inválido.", type: 'error' });
        setLoadingRefs(false); 
        return;
    }
    
    // Usar la función del hook
    fetchProductById(idProducto);
  }, [fetchProductById, idProducto]);


  // ----------------------------------------------------
  // 3. SUBMIT FINAL (Usa updateProduct del hook)
  // ----------------------------------------------------
  const handleUpdate = async (formData: FormData) => {
    setFeedbackMessage(null); 
    try {
      // CRÍTICO: Pasamos el FormData, el hook lo envía a PUT /productos/{id}.
      await updateProduct(idProducto, formData); 

      setFeedbackMessage({ message: "Producto actualizado correctamente.", type: 'success' });
      
      // Opcional: Redirigir al listado
      setTimeout(() => {
          navigate("/admin/productos");
      }, 1500); 

    } catch (err) {
      // Captura el error lanzado por el hook
      const errorMessage = (err as Error).message || "Error desconocido al actualizar producto.";
      setFeedbackMessage({ message: errorMessage, type: 'error' });
    }
  };

  // ----------------------------------------------------
  // Render condicional
  // ----------------------------------------------------

  const isGlobalLoading = isLoading || loadingRefs;
  
  if (isGlobalLoading) {
    return (
        <div className="flex justify-center items-center p-6 min-h-screen">
            <p className="text-xl text-gray-600">Cargando datos del producto...</p>
        </div>
    );
  }

  // Si no hay producto y ya terminó de cargar
  if (!product) {
      const errorMsg = hookError || feedbackMessage?.message || "No se encontró el producto especificado.";
      return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-red-800">Error de Carga</h1>
            <p className="p-4 bg-red-100 text-red-700 rounded-lg border-l-4 border-red-400">
                {errorMsg}
            </p>
        </div>
      );
  }

  // Mapear datos del Producto a los initialValues esperados por FormFields
  const initialFormValues: Partial<FormFields> = {
    // Usamos el producto completo para inicializar el formulario
    idCategoria: product.idCategoria,
    idMarca: product.idMarca,
    sku: product.sku ?? undefined, 
    nombreProducto: product.nombreProducto,
    descripcionProducto: product.descripcionProducto ?? undefined,
    precioCompraProducto: product.precioCompraProducto, 
    productoActivo: product.productoActivo,
    urlImagenProducto: product.urlImagenProducto,
    publicIdImagen: product.publicIdImagen,
    imagen: undefined, 
  };
  
  // Clases dinámicas para feedback
  const feedbackClasses = feedbackMessage?.type === 'error'
    ? 'bg-red-100 text-red-700 border-red-400'
    : 'bg-green-100 text-green-700 border-green-400';


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Editar Producto: {product.nombreProducto}</h1>

      {feedbackMessage && (
        <div className={`p-4 mb-6 rounded-lg border-l-4 font-medium ${feedbackClasses}`}>
          {feedbackMessage.message}
        </div>
      )}
      
      <ProductForm
        isEditing={true}
        categorias={categorias}
        marcas={marcas}
        initialValues={initialFormValues}
        onSubmit={handleUpdate}
      />
    </div>
  );
}