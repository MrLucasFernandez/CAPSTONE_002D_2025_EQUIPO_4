import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type {ProductFormData} from "../validations/product.schema";
import {
  productCreateSchema,
  productUpdateSchema,
} from "../validations/product.schema";

import type { Categoria, Marca } from "../../../../types/product";

export interface ProductFormProps {
  isEditing?: boolean;
  initialValues: Partial<ProductFormData> & { urlImagenProducto?: string | null };
  categorias: Categoria[];
  marcas: Marca[];
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function ProductForm({
  isEditing = false,
  initialValues,
  categorias,
  marcas,
  onSubmit,
}: ProductFormProps) {
  // Seleccionar schema dinámicamente
  const schema = isEditing ? productUpdateSchema : productCreateSchema;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  // Para mostrar preview de imagen
  const selectedImage = watch("imagen");

  // Reset cuando cambie initialValues
  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  // ---------------------------------------------------------
  // Submit handler → genera FormData y lo envía al padre
  // ---------------------------------------------------------
  const handleFormSubmit = async (data: ProductFormData) => {
    const formData = new FormData();
    formData.append("nombreProducto", data.nombreProducto);
    formData.append("precioCompraProducto", String(data.precioCompraProducto));
    formData.append("idCategoria", String(data.idCategoria));
    formData.append("idMarca", String(data.idMarca));

    if (data.descripcionProducto)
      formData.append("descripcionProducto", data.descripcionProducto);

    if (data.sku) formData.append("sku", data.sku);

    if (data.productoActivo !== undefined)
      formData.append("productoActivo", String(data.productoActivo));

    if (data.imagen instanceof File) {
      formData.append("imagen", data.imagen);
    }

    await onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 bg-white p-6 rounded shadow-lg"
    >
      {/* --- Nombre --- */}
      <div>
        <label className="block font-semibold">Nombre</label>
        <input
          {...register("nombreProducto")}
          className="w-full p-2 border rounded"
        />
        {errors.nombreProducto && (
          <p className="text-red-600 text-sm">{errors.nombreProducto.message}</p>
        )}
      </div>

      {/* --- Precio Compra --- */}
      <div>
        <label className="block font-semibold">Precio de Compra</label>
        <input
          type="number"
          {...register("precioCompraProducto")}
          className="w-full p-2 border rounded"
        />
        {errors.precioCompraProducto && (
          <p className="text-red-600 text-sm">
            {errors.precioCompraProducto.message}
          </p>
        )}
      </div>

      {/* --- Categoría --- */}
      <div>
        <label className="block font-semibold">Categoría</label>
        <select {...register("idCategoria")} className="w-full p-2 border rounded">
          <option value="">Seleccione...</option>
          {categorias.map((c) => (
            <option key={c.idCategoria} value={c.idCategoria}>
              {c.nombreCategoria}
            </option>
          ))}
        </select>
        {errors.idCategoria && (
          <p className="text-red-600 text-sm">{errors.idCategoria.message}</p>
        )}
      </div>

      {/* --- Marca --- */}
      <div>
        <label className="block font-semibold">Marca</label>
        <select {...register("idMarca")} className="w-full p-2 border rounded">
          <option value="">Seleccione...</option>
          {marcas.map((m) => (
            <option key={m.idMarca} value={m.idMarca}>
              {m.nombreMarca}
            </option>
          ))}
        </select>
        {errors.idMarca && (
          <p className="text-red-600 text-sm">{errors.idMarca.message}</p>
        )}
      </div>

      {/* --- Descripción --- */}
      <div>
        <label className="block font-semibold">Descripción</label>
        <textarea
          {...register("descripcionProducto")}
          className="w-full p-2 border rounded"
        />
        {errors.descripcionProducto && (
          <p className="text-red-600 text-sm">
            {errors.descripcionProducto.message}
          </p>
        )}
      </div>

      {/* --- SKU --- */}
      <div>
        <label className="block font-semibold">SKU</label>
        <input {...register("sku")} className="w-full p-2 border rounded" />
      </div>

      {/* --- Imagen --- */}
      <div>
        <label className="block font-semibold">Imagen</label>
        <input
          type="file"
          accept="image/*"
          {...register("imagen")}
          className="w-full"
        />

        {/* Preview al editar */}
        {initialValues.urlImagenProducto && !selectedImage && (
          <img
            src={initialValues.urlImagenProducto}
            alt="Imagen actual"
            className="w-32 mt-2 rounded"
          />
        )}

        {/* Preview local */}
        {selectedImage instanceof File && (
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Preview"
            className="w-32 mt-2 rounded"
          />
        )}

        {errors.imagen && (
          <p className="text-red-600 text-sm">{errors.imagen.message}</p>
        )}
      </div>

      {/* --- Botón --- */}
      <button
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        {isEditing ? "Actualizar" : "Crear Producto"}
      </button>
    </form>
  );
}
