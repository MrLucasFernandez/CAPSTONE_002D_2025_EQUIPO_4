import { useEffect } from "react";
import { useForm, type FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  productCreateSchema,
  productUpdateSchema,
  type ProductCreateData,
  type ProductUpdateData,
} from "../validations/product.schema";

import type { Categoria, Marca, Bodega } from "../../../../types/product";

// Tipo final combinado
export type FormFields = ProductCreateData &
  ProductUpdateData & {
    stockInicial?: number | null;
    idBodega?: number | null;
  };

export interface ProductFormProps {
  isEditing?: boolean;
  initialValues: Partial<FormFields>;
  categorias: Categoria[];
  marcas: Marca[];
  bodegas: Bodega[];
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function ProductForm({
  isEditing = false,
  initialValues,
  categorias,
  marcas,
  bodegas,
  onSubmit,
}: ProductFormProps) {
  console.log("📦 Bodegas recibidas en ProductForm:", bodegas);
  const schema = isEditing ? productUpdateSchema : productCreateSchema;

  const methods = useForm<FormFields>({
    resolver: zodResolver(schema as any),
    defaultValues: initialValues as FormFields,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;

  useEffect(() => {
    reset(initialValues as FormFields);
  }, [initialValues, reset]);

  const selectedImage = watch("imagen");

  const handleFormSubmit = async (data: FormFields) => {
    const formData = new FormData();

    // --- Campos obligatorios ---
    formData.append("nombreProducto", data.nombreProducto);
    formData.append("precioCompraProducto", String(data.precioCompraProducto));
    formData.append("idCategoria", String(data.idCategoria));
    formData.append("idMarca", String(data.idMarca));

    // --- Opcionales ---
    if (data.descripcionProducto)
      formData.append("descripcionProducto", data.descripcionProducto);

    if (data.sku) formData.append("sku", data.sku);

    if (data.productoActivo !== undefined)
      formData.append("productoActivo", String(data.productoActivo));

    // --- Imagen ---
    if (data.imagen instanceof File) {
      formData.append("imagen", data.imagen);
    }

    // --- stockInicial SOLO en CREATE ---
    if (!isEditing && data.stockInicial != null) {
      formData.append("stockInicial", String(data.stockInicial));
    }

    // --- idBodega SIEMPRE opcional ---
    if (data.idBodega !== undefined && data.idBodega !== null) {
      formData.append("idBodega", String(data.idBodega));
    }

    await onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 bg-white p-6 rounded-xl shadow-xl"
    >
      {/* Nombre */}
      <div>
        <label className="block font-semibold text-gray-700">
          Nombre del Producto
        </label>
        <input
          {...register("nombreProducto")}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="Ej: Limpiador Multiuso"
        />
        {errors.nombreProducto && (
          <p className="text-red-600 text-sm mt-1">
            {(errors.nombreProducto as FieldError).message}
          </p>
        )}
      </div>

      {/* Precio */}
      <div>
        <label className="block font-semibold text-gray-700">
          Precio de Compra (CLP)
        </label>
        <input
          type="number"
          {...register("precioCompraProducto", { valueAsNumber: true })}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="0"
        />
        {errors.precioCompraProducto && (
          <p className="text-red-600 text-sm mt-1">
            {(errors.precioCompraProducto as FieldError).message}
          </p>
        )}
      </div>

      {/* Categoría */}
      <div>
        <label className="block font-semibold text-gray-700">Categoría</label>
        <select
          {...register("idCategoria", { valueAsNumber: true })}
          className="w-full p-3 border border-gray-300 rounded-lg"
        >
          <option value="">Seleccione...</option>
          {categorias.map((c) => (
            <option key={c.idCategoria} value={c.idCategoria}>
              {c.nombreCategoria}
            </option>
          ))}
        </select>
      </div>

      {/* Marca */}
      <div>
        <label className="block font-semibold text-gray-700">Marca</label>
        <select
          {...register("idMarca", { valueAsNumber: true })}
          className="w-full p-3 border border-gray-300 rounded-lg"
        >
          <option value="">Seleccione...</option>
          {marcas.map((m) => (
            <option key={m.idMarca} value={m.idMarca}>
              {m.nombreMarca}
            </option>
          ))}
        </select>
      </div>

      {/* Bodega */}
      <div>
        <label className="block font-semibold text-gray-700">Bodega</label>
        <select
          {...register("idBodega", { valueAsNumber: true })}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
        >
          <option value="" className="text-gray-700 bg-white">Seleccione...</option>
          {bodegas.map((b) => (
            <option
              key={b.idBodega}
              value={b.idBodega}
              className="text-gray-900 bg-white"
            >
              {b.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Stock Inicial — SOLO EN CREATE */}
      {!isEditing && (
        <div>
          <label className="block font-semibold text-gray-700">
            Stock Inicial
          </label>
          <input
            type="number"
            {...register("stockInicial", { valueAsNumber: true })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="0"
          />
          {errors.stockInicial && (
            <p className="text-red-600 text-sm mt-1">
              {(errors.stockInicial as FieldError).message}
            </p>
          )}
        </div>
      )}

      {/* Descripción */}
      <div>
        <label className="block font-semibold text-gray-700">
          Descripción
        </label>
        <textarea
          {...register("descripcionProducto")}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      {/* SKU */}
      <div>
        <label className="block font-semibold text-gray-700">SKU</label>
        <input
          {...register("sku")}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Activo */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...register("productoActivo")}
          className="w-4 h-4"
        />
        <label className="font-semibold text-gray-700">
          Producto Activo
        </label>
      </div>

      {/* Imagen */}
      <div>
        <label className="block font-semibold text-gray-700">
          Imagen del Producto
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setValue("imagen", e.target.files?.[0])}
          className="block w-full text-sm"
        />

        {errors.imagen && (
          <p className="text-red-600 text-sm mt-1">
            {(errors.imagen as FieldError).message}
          </p>
        )}

        {/* Preview */}
        <div className="mt-4 flex space-x-4">
          {isEditing &&
            initialValues.urlImagenProducto &&
            !selectedImage && (
              <img
                src={initialValues.urlImagenProducto}
                className="w-32 h-32 object-cover rounded-lg border"
              />
            )}

          {selectedImage instanceof File && (
            <img
              src={URL.createObjectURL(selectedImage)}
              className="w-32 h-32 object-cover rounded-lg border-2 border-green-400"
            />
          )}
        </div>
      </div>

      {/* Botón */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-bold"
      >
        {isSubmitting
          ? "Enviando..."
          : isEditing
          ? "Actualizar Producto"
          : "Crear Producto"}
      </button>
    </form>
  );
}
