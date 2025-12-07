// src/modules/admin/products/pages/ProductCreatePage.tsx
import ProductFormBuilderAdapter from "../components/ProductFormBuilderAdapter";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAdminProducts } from "../hooks/useAdminProducts";

import { fetchCategories } from "@/modules/admin/categories/api/adminCategoryService";
import { fetchBrands } from "@/modules/admin/brands/api/adminBrandService";
import { fetchWarehouses } from "@admin/products/api/adminProductsService";

import type { Categoria, Marca, Bodega } from "@models/product";

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const { createProduct } = useAdminProducts();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [loadingRefs, setLoadingRefs] = useState(true);

  const [feedbackMessage, setFeedbackMessage] = useState<
    { message: string; type: "success" | "error" } | null
  >(null);

  // ===========================================================
  // 🔵 1. Cargar referencias (categorías, marcas, bodegas)
  // ===========================================================
  useEffect(() => {
    async function loadRefs() {
      try {
        const [cats, brands, warehouses] = await Promise.all([
          fetchCategories(),
          fetchBrands(),
          fetchWarehouses(),
        ]);

        setCategorias(cats);
        setMarcas(brands);
        setBodegas(warehouses);
      } catch (error) {
        console.error("Error cargando referencias", error);
        setFeedbackMessage({
          message: "No se pudieron cargar categorías, marcas o bodegas.",
          type: "error",
        });
      } finally {
        setLoadingRefs(false);
      }
    }

    loadRefs();
  }, []);

  // ===========================================================
  // 🔵 2. Crear producto
  // ===========================================================
  const handleCreate = async (formData: FormData | Record<string, any>) => {
    setFeedbackMessage(null);

    try {
      await createProduct(formData);
      setFeedbackMessage({
        message: "Producto creado correctamente.",
        type: "success",
      });

      // Redirigir suavemente
      setTimeout(() => navigate("/admin/productos"), 1500);
    } catch (err) {
      const msg =
        (err as Error).message || "Error desconocido al crear producto.";
      setFeedbackMessage({ message: msg, type: "error" });
    }
  };

  // ===========================================================
  // 🔵 3. Valores iniciales de formulario
  // ===========================================================
  const initialFormValues = {
    nombreProducto: "",
    precioCompraProducto: 0,
    idCategoria: 0,
    idMarca: 0,
    descripcionProducto: "",
    sku: "",
    productoActivo: true,
    imagen: null,
    stockInicial: 0,
    idBodega: 0,
  };

  // ===========================================================
  // 🔵 Loading UI
  // ===========================================================
  if (loadingRefs) {
    return (
      <div className="flex justify-center items-center p-6 min-h-screen">
        <p className="text-xl text-gray-600">
          Cargando datos de referencia...
        </p>
      </div>
    );
  }

  const feedbackClasses =
    feedbackMessage?.type === "error"
      ? "bg-red-100 text-red-700 border-red-400"
      : "bg-green-100 text-green-700 border-green-400";

  // ===========================================================
  // 🔵 Render final
  // ===========================================================
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Crear Nuevo Producto
      </h1>

      {feedbackMessage && (
        <div
          className={`p-4 mb-6 rounded-lg border-l-4 font-medium ${feedbackClasses}`}
        >
          {feedbackMessage.message}
        </div>
      )}

      <ProductFormBuilderAdapter
        mode="create"
        categorias={categorias}
        marcas={marcas}
        bodegas={bodegas}
        initialValues={initialFormValues}
        onSubmit={handleCreate}
      />
    </div>
  );
}
