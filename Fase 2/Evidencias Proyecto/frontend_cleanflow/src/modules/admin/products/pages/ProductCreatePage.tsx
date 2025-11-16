// src/modules/admin/products/pages/ProductCreatePage.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductForm from "../components/ProductForm";

import {
  fetchCategories,
  fetchBrands,
  createAdminProduct,
} from "../api/adminProductsService";

import type { Categoria, Marca } from "../../../../types/product";

export default function ProductCreatePage() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loadingRefs, setLoadingRefs] = useState(true);

  useEffect(() => {
    async function loadRefs() {
      try {
        const categorias = await fetchCategories();
        const marcas = await fetchBrands();

        setCategorias(categorias);
        setMarcas(marcas);
      } catch (error) {
        console.error("Error cargando categorías o marcas", error);
      } finally {
        setLoadingRefs(false);
      }
    }

    loadRefs();
  }, []);

  const handleCreate = async (formData: FormData) => {
    try {
      await createAdminProduct(formData);
      alert("Producto creado correctamente");
      navigate("/admin/productos");
    } catch (err) {
      alert("Error al crear producto: " + (err as Error).message);
    }
  };

  if (loadingRefs) {
    return <p className="p-6">Cargando datos...</p>;
  }

  return (
    <div className="p-6">
      <ProductForm
        isEditing={false}
        categorias={categorias}
        marcas={marcas}
        onSubmit={handleCreate}
        initialValues={{
          nombreProducto: "",
          precioCompraProducto: 0,
          idCategoria: 0,
          idMarca: 0,
          descripcionProducto: "",
          sku: "",
          productoActivo: true,
          imagen: undefined,
        }}
      />
    </div>
  );
}
