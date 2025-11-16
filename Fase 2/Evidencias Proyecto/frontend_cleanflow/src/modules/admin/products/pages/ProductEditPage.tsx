// src/modules/admin/products/pages/ProductEditPage.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ProductForm from "../components/ProductForm";

import {
  fetchCategories,
  fetchBrands,
  getAdminProductById,
  updateAdminProduct,
  uploadProductImage,
} from "../api/adminProductsService";

import type { Categoria, Marca, Producto } from "../../../../types/product";

export default function ProductEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const idProducto = Number(id);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [product, setProduct] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);

  // ----------------------------------------------------
  // Cargar categorías y marcas
  // ----------------------------------------------------
  useEffect(() => {
    async function loadRefs() {
      setCategorias(await fetchCategories());
      setMarcas(await fetchBrands());
    }
    loadRefs();
  }, []);

  // ----------------------------------------------------
  // Cargar producto por ID
  // ----------------------------------------------------
  useEffect(() => {
    async function loadProduct() {
      const p = await getAdminProductById(idProducto);
      setProduct(p);
      setLoading(false);
    }
    loadProduct();
  }, [idProducto]);

  // ----------------------------------------------------
  // SUBMIT FINAL
  // ----------------------------------------------------
  const handleUpdate = async (values: any) => {
    try {
      let imageUrl = product?.urlImagenProducto ?? null;
      let imagePublicId = product?.publicIdImagen ?? null;

      // Si el usuario subió nueva imagen
      if (values.imagen instanceof File) {
        const upload = await uploadProductImage(values.imagen);
        imageUrl = upload.url;
        imagePublicId = upload.publicId;
      }

      // Crear el objeto EXACTO que tu backend espera
      const body = {
        idCategoria: Number(values.idCategoria),
        idMarca: Number(values.idMarca),
        sku: values.sku,
        nombreProducto: values.nombreProducto,
        descripcionProducto: values.descripcionProducto ?? "",
        precioProducto: Number(values.precioProducto),
        precioVentaProducto: Number(values.precioVentaProducto),
        urlImagenProducto: imageUrl,
        publicIdImagen: imagePublicId,
      };

      await updateAdminProduct(idProducto, body as any);

      alert("Producto actualizado correctamente");
      navigate("/admin/productos");
    } catch (err) {
      alert("Error al actualizar: " + (err as Error).message);
    }
  };

  if (loading || !product) {
    return <p className="p-6">Cargando datos...</p>;
  }

  return (
    <div className="p-6">
      <ProductForm
        isEditing={true}
        categorias={categorias}
        marcas={marcas}
        initialValues={{
          idCategoria: product.idCategoria,
          idMarca: product.idMarca,
          sku: product.sku ?? "",
          nombreProducto: product.nombreProducto ?? "",
          descripcionProducto: product.descripcionProducto ?? "",
          precioCompraProducto: product.precioCompraProducto ?? 0,
          urlImagenProducto: product.urlImagenProducto ?? null,
          imagen: undefined, // nueva imagen opcional
        }}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
