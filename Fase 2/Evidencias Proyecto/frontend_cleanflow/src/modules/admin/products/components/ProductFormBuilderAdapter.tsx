// src/modules/admin/products/components/ProductFormBuilderAdapter.tsx
import type { Categoria, Marca, Bodega, Producto } from "@models/product";
import { ProductFormBuilder } from "@organisms/admin/ProductFormBuilder/ProductFormBuilder";

type Mode = "create" | "edit";

interface ProductFormBuilderAdapterProps {
  mode: Mode;
  categorias: Categoria[];
  marcas: Marca[];
  bodegas: Bodega[];
  initialValues?: Record<string, any>;
  product?: Producto | null; 
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function ProductFormBuilderAdapter({
  mode,
  categorias,
  marcas,
  bodegas,
  initialValues = {},
  product,
  onSubmit,
}: ProductFormBuilderAdapterProps) {

  // imagen actual existente sólo en modo edit
  const imagePreviewUrl =
    mode === "edit" &&
    product &&
    typeof product.urlImagenProducto === "string"
      ? product.urlImagenProducto
      : null;

  return (
    <ProductFormBuilder
      mode={mode}
      categorias={categorias}
      marcas={marcas}
      bodegas={bodegas}
      initialValues={initialValues}
      imagePreviewUrl={imagePreviewUrl}
      onSubmit={onSubmit}
    />
  );
}
