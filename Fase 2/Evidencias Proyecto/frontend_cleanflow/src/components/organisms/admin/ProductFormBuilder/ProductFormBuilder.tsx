// src/components/organisms/admin/ProductFormBuilder/ProductFormBuilder.tsx
import { useEffect } from "react";
import { useForm, type FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// UI
import AdminCard from "@molecules/admin/AdminCard";
import AdminButton from "@atoms/admin/AdminButton";
import { AdminInput } from "@atoms/admin/AdminInput";
import { AdminTextarea } from "@atoms/admin/AdminTextarea";
import { AdminSelect } from "@atoms/admin/AdminSelect";
import { UploadImageField } from "./widgets/UploadImageField";
// Schemas
import { productCreateSchema } from "@admin/products/validations/product.create.schema";
import { productUpdateSchema } from "@admin/products/validations/product.update.schema";

import type { Categoria, Marca, Bodega } from "@models/product";

type ProductFormMode = "create" | "edit";

interface ProductFormBuilderProps {
  mode: ProductFormMode;
  categorias: Categoria[];
  marcas: Marca[];
  bodegas: Bodega[];
  initialValues?: Record<string, any>;
  imagePreviewUrl?: string | null;
  onSubmit: (formData: FormData) => Promise<void>;
}

export function ProductFormBuilder({
  mode,
  categorias,
  marcas,
  bodegas,
  initialValues = {},
  imagePreviewUrl,
  onSubmit,
}: ProductFormBuilderProps) {
  const isEditing = mode === "edit";

  const schema = isEditing ? productUpdateSchema : productCreateSchema;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  // Reset automático si cambian valores iniciales
  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  // Imagen seleccionada (la que eliges en el input file)
  const selectedImage = watch("imagen");

  // ------------------------------ SUBMIT ------------------------------
  const handleFormSubmit = async (data: any) => {
    console.log("🔍 DATA.imagen:", data.imagen);
    console.log("🔍 Es File?:", data.imagen instanceof File);

    const fd = new FormData();

    const append = (key: string, value: any) => {
      if (value !== undefined && value !== null && value !== "") {
        fd.append(key, String(value));
      }
    };

    append("nombreProducto", data.nombreProducto);
    append("precioCompraProducto", data.precioCompraProducto);
    append("idCategoria", data.idCategoria);
    append("idMarca", data.idMarca);

    append("descripcionProducto", data.descripcionProducto);
    append("sku", data.sku);
    append("productoActivo", data.productoActivo);

    // Solo en create
    if (!isEditing) append("stockInicial", data.stockInicial);

    append("idBodega", data.idBodega);

    // Imagen si se seleccionó una nueva (este es el campo importante)
    if (data.imagen instanceof File) {
      fd.append("imagen", data.imagen);
    }

    console.log("📦 FORM DATA FINAL:");
    for (const pair of fd.entries()) {
      console.log(" ➜", pair[0], pair[1]);
    }

    await onSubmit(fd);
  };

  // ------------------------------ UI ------------------------------

  const title = isEditing ? "Editar Producto" : "Crear Producto";
  const submitLabel = isEditing ? "Guardar cambios" : "Crear producto";

  return (
    <AdminCard title={title}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-6 bg-white p-6 rounded-xl shadow-lg"
      >
        {/* Nombre */}
        <AdminInput
          label="Nombre del producto"
          placeholder="Ej: Limpiador Multiuso"
          error={(errors.nombreProducto as FieldError)?.message}
          {...register("nombreProducto")}
        />

        {/* Precio */}
        <AdminInput
          label="Precio de compra (CLP)"
          type="number"
          placeholder="0"
          error={(errors.precioCompraProducto as FieldError)?.message}
          {...register("precioCompraProducto", { valueAsNumber: true })}
        />

        {/* Categoría */}
        <AdminSelect
          label="Categoría"
          options={categorias.map((c) => ({
            label: c.nombreCategoria,
            value: c.idCategoria,
          }))}
          error={(errors.idCategoria as FieldError)?.message}
          {...register("idCategoria", { valueAsNumber: true })}
        />

        {/* Marca */}
        <AdminSelect
          label="Marca"
          options={marcas.map((m) => ({
            label: m.nombreMarca,
            value: m.idMarca,
          }))}
          error={(errors.idMarca as FieldError)?.message}
          {...register("idMarca", { valueAsNumber: true })}
        />

        {/* Bodega */}
        <AdminSelect
          label="Bodega"
          options={bodegas.map((b) => ({
            label: b.nombre,
            value: b.idBodega,
          }))}
          error={(errors.idBodega as FieldError)?.message}
          {...register("idBodega", { valueAsNumber: true })}
        />

        {/* Stock inicial SOLO en create */}
        {!isEditing && (
          <AdminInput
            label="Stock inicial"
            type="number"
            placeholder="0"
            error={(errors.stockInicial as FieldError)?.message}
            {...register("stockInicial", { valueAsNumber: true })}
          />
        )}

        {/* Descripción */}
        <AdminTextarea
          label="Descripción"
          rows={3}
          error={(errors.descripcionProducto as FieldError)?.message}
          {...register("descripcionProducto")}
        />

        {/* SKU */}
        <AdminInput
          label="SKU"
          error={(errors.sku as FieldError)?.message}
          {...register("sku")}
        />

        {/* Activo */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="size-4"
            {...register("productoActivo")}
          />
          <span className="font-medium text-gray-700">Producto activo</span>
        </label>

        {/* Imagen (versión simple, como en el ProductForm original) */}
        <UploadImageField
          label="Imagen del producto"
          error={(errors.imagen as FieldError)?.message}
          currentUrl={imagePreviewUrl}
          file={selectedImage instanceof File ? selectedImage : null}
          onFileSelect={(file) =>
            setValue("imagen", file, { shouldValidate: true })
          }
        />
        
        <AdminButton loading={isSubmitting} className="w-full">
          {submitLabel}
        </AdminButton>
      </form>
    </AdminCard>
  );
}
