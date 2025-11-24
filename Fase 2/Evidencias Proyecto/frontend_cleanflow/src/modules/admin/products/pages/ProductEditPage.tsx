// src/modules/admin/products/pages/ProductEditPage.tsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ProductFormBuilderAdapter from "../components/ProductFormBuilderAdapter";
import { useAdminProducts } from "../hooks/useAdminProducts";

// Servicios
import { fetchWarehouses } from "../api/adminProductsService";
import { fetchCategories } from "@admin/categories/api/categoryService";
import { fetchBrands } from "@admin/brands/api/brandService";

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

  // ----------------------------------------------------
  // 1. Cargar categorías, marcas y bodegas
  // ----------------------------------------------------
  const loadRefs = useCallback(async () => {
    try {
      const [categorias, marcas, bodegas] = await Promise.all([
        fetchCategories(),
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
  const handleUpdate = async (formData: FormData) => {
    setFeedbackMessage(null);

    // Se asegura de que API no reciba idProducto en el body
    formData.delete("idProducto");

    try {
      await updateProduct(idProducto, formData);

      setFeedbackMessage({
        message: "Producto actualizado correctamente.",
        type: "success",
      });

      setTimeout(() => navigate("/admin/productos"), 1500);
    } catch (err) {
      setFeedbackMessage({
        message:
          (err as Error).message || "Error desconocido al actualizar producto.",
        type: "error",
      });
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
    idBodega: product.idBodega ?? undefined,
    nombreProducto: product.nombreProducto,
    descripcionProducto: product.descripcionProducto ?? undefined,
    precioCompraProducto: product.precioCompraProducto,
    sku: product.sku ?? undefined,
    productoActivo: product.productoActivo,
  };

  const feedbackClasses =
    feedbackMessage?.type === "error"
      ? "bg-red-100 text-red-700 border-red-400"
      : "bg-green-100 text-green-700 border-green-400";

  // ----------------------------------------------------
  // 6. Render final
  // ----------------------------------------------------
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Editar Producto: {product.nombreProducto}
      </h1>

      {feedbackMessage && (
        <div className={`p-4 mb-6 rounded-lg border-l-4 ${feedbackClasses}`}>
          {feedbackMessage.message}
        </div>
      )}

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
