// src/modules/admin/products/pages/ProductEditPage.tsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ProductFormBuilderAdapter from "../components/organisms/ProductFormBuilderAdapter";
import { useAdminProducts } from "../hooks/useAdminProducts";
import Toast from "@components/ui/Toast";

// Servicios
import { fetchWarehouses } from "../api/adminProductsService";
import { fetchAdminCategories } from "@modules/admin/categories/api/adminCategoryService";
import { fetchBrands } from "@modules/admin/brands/api/adminBrandService";

import type { Categoria, Marca, Bodega } from "@models/product";

export default function ProductEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const idProducto = Number(id);

  const {
    fetchProductById,
    updateProduct,
    product,
    isLoading: isProductLoading,
    error: hookError,
  } = useAdminProducts();

  // ----------------------------------------------------
  // Estado general del formulario
  // ----------------------------------------------------
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [loadingRefs, setLoadingRefs] = useState(true);

  const [feedbackMessage, setFeedbackMessage] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [showToast, setShowToast] = useState(false);

  // ----------------------------------------------------
  // 1. Cargar categorías, marcas y bodegas
  // ----------------------------------------------------
  const loadRefs = useCallback(async () => {
    try {
      const [categorias, marcas, bodegas] = await Promise.all([
        fetchAdminCategories(),
        fetchBrands(),
        fetchWarehouses(),
      ]);

      setCategorias(categorias);
      setMarcas(marcas);
      setBodegas(bodegas);
    } catch (error) {
      console.error("Error cargando referencias", error);
      setFeedbackMessage({
        message: "Error cargando categorías, marcas o bodegas.",
        type: "error",
      });
    } finally {
      setLoadingRefs(false);
    }
  }, []);

  useEffect(() => {
    loadRefs();
  }, [loadRefs]);

  // ----------------------------------------------------
  // 2. Cargar producto por ID
  // ----------------------------------------------------
  useEffect(() => {
    if (!idProducto || isNaN(idProducto) || idProducto <= 0) {
      setFeedbackMessage({
        message: "ID de producto inválido.",
        type: "error",
      });
      return;
    }

    fetchProductById(idProducto);
  }, [idProducto, fetchProductById]);

  // ----------------------------------------------------
  // 3. Enviar actualización
  // ----------------------------------------------------
  const handleUpdate = async (formData: FormData | Record<string, any>) => {
    setFeedbackMessage(null);

    // Se asegura de que API no reciba idProducto en el body
    try {
      if (formData instanceof FormData) {
        formData.delete("idProducto");
      } else if (formData && typeof formData === 'object') {
        // eliminar propiedad si existe
        if ((formData as Record<string, any>).hasOwnProperty('idProducto')) {
          delete (formData as Record<string, any>).idProducto;
        }
      }
    } catch (e) {
      // no bloquear en caso de error
      console.warn('No se pudo eliminar idProducto del payload:', e);
    }

    try {
      await updateProduct(idProducto, formData);

      setFeedbackMessage({
        message: "Producto actualizado correctamente.",
        type: "success",
      });
      setShowToast(true);

      setTimeout(() => navigate("/admin/productos"), 2000);
    } catch (err) {
      setFeedbackMessage({
        message:
          (err as Error).message || "Error desconocido al actualizar producto.",
        type: "error",
      });
      setShowToast(true);
    }
  };

  // ----------------------------------------------------
  // 4. Loading y errores
  // ----------------------------------------------------
  const isGlobalLoading = loadingRefs || isProductLoading;

  if (isGlobalLoading) {
    return (
      <div className="flex justify-center items-center p-6 min-h-screen">
        <p className="text-xl text-gray-600">Cargando datos del producto...</p>
      </div>
    );
  }

  if (!product) {
    const msg =
      hookError || feedbackMessage?.message || "No se encontró el producto.";

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-red-800">Error de Carga</h1>
        <p className="p-4 bg-red-100 text-red-700 rounded-lg border-l-4 border-red-400">
          {msg}
        </p>
      </div>
    );
  }

  // ----------------------------------------------------
  // 5. Valores iniciales del formulario
  // ----------------------------------------------------
  const initialFormValues = {
    idCategoria: product.idCategoria,
    idMarca: product.idMarca,
    // Si el backend no incluye `idBodega` en el nivel del producto, intentar obtenerla
    // desde el último registro de `stock` (si existe).
    idBodega:
      product.idBodega ??
      (product.stock && product.stock.length > 0
        ? product.stock[product.stock.length - 1].bodega?.idBodega ?? undefined
        : undefined),
    // Valor inicial de stock: usar la cantidad del último registro de stock si existe
    stock:
      product.stock && product.stock.length > 0
        ? product.stock[product.stock.length - 1].cantidad
        : undefined,
    nombreProducto: product.nombreProducto,
    descripcionProducto: product.descripcionProducto ?? undefined,
    precioCompraProducto: product.precioCompraProducto,
    sku: product.sku ?? undefined,
    productoActivo: product.productoActivo,
  };
  // ----------------------------------------------------
  // 6. Render final
  // ----------------------------------------------------
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {showToast && feedbackMessage && (
        <Toast
          message={feedbackMessage.message}
          type={feedbackMessage.type}
          onClose={() => setShowToast(false)}
          duration={feedbackMessage.type === "success" ? 2000 : 4000}
        />
      )}

      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Editar Producto: {product.nombreProducto}
      </h1>

      <ProductFormBuilderAdapter
        mode="edit"
        categorias={categorias}
        marcas={marcas}
        bodegas={bodegas}
        initialValues={initialFormValues}
        product={product}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
