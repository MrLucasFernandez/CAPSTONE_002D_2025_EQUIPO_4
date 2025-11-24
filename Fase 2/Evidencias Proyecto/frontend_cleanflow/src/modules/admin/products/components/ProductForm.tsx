import { useEffect } from "react";
import { useForm, type FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  productCreateSchema,
  productUpdateSchema
} from "../validations/product.schema";

import type { Categoria, Marca, Bodega } from "@models/product";

/* ===========================================================
  FORMFIELDS — SIN idProducto, SIN urlImagenProducto
=========================================================== */
export type FormFields = {
  nombreProducto?: string;
  precioCompraProducto?: number;
  idCategoria?: number;
  idMarca?: number;
  descripcionProducto?: string | null;
  sku?: string | null;
  productoActivo?: boolean;
  imagen?: File | null;

  stockInicial?: number | null;
  idBodega?: number | null;
};

export interface ProductFormProps {
  isEditing?: boolean;
  initialValues: Partial<FormFields>;
  imagePreviewUrl?: string | null;
  categorias: Categoria[];
  marcas: Marca[];
  bodegas: Bodega[];
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function ProductForm({
  isEditing = false,
  initialValues,
  imagePreviewUrl,
  categorias,
  marcas,
  bodegas,
  onSubmit,
}: ProductFormProps) {
  const schema = isEditing ? productUpdateSchema : productCreateSchema;

  /* ===========================================================
     DEFAULT VALUES — SOLO CAMPOS PERMITIDOS
  ============================================================ */
  const methods = useForm<FormFields>({
    resolver: zodResolver(schema as any),
    defaultValues: {
      nombreProducto: initialValues.nombreProducto,
      precioCompraProducto: initialValues.precioCompraProducto,
      idCategoria: initialValues.idCategoria,
      idMarca: initialValues.idMarca,
      descripcionProducto: initialValues.descripcionProducto,
      sku: initialValues.sku,
      productoActivo: initialValues.productoActivo,
      idBodega: initialValues.idBodega,
      stockInicial: initialValues.stockInicial,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = methods;

  /* ===========================================================
     RESET CONTROLADO SIN urlImagenProducto, SIN idProducto
  ============================================================ */
  useEffect(() => {
    console.log("🔄 RESET con initialValues:", initialValues);

    reset({
      nombreProducto: initialValues.nombreProducto,
      precioCompraProducto: initialValues.precioCompraProducto,
      idCategoria: initialValues.idCategoria,
      idMarca: initialValues.idMarca,
      descripcionProducto: initialValues.descripcionProducto,
      sku: initialValues.sku,
      productoActivo: initialValues.productoActivo,
      idBodega: initialValues.idBodega,
      stockInicial: initialValues.stockInicial,
    });

    console.log("🔥 Campos después del reset:", Object.keys(getValues()));
  }, [initialValues, reset, getValues]);

  const selectedImage = watch("imagen");

  /* ===========================================================
     SUBMIT — TOTALMENTE LIMPIO
  ============================================================ */
  const handleFormSubmit = async (data: FormFields) => {
    console.log("🔥 DATA en RHF (entrada):", data);

    // blindado: por si apareciera
    delete (data as any).idProducto;
    delete (data as any).urlImagenProducto;

    console.log("🧹 DATA limpia:", data);

    const formData = new FormData();

    if (data.nombreProducto)
      formData.append("nombreProducto", data.nombreProducto);

    if (data.precioCompraProducto !== undefined)
      formData.append("precioCompraProducto", String(data.precioCompraProducto));

    if (data.idCategoria !== undefined)
      formData.append("idCategoria", String(data.idCategoria));

    if (data.idMarca !== undefined)
      formData.append("idMarca", String(data.idMarca));

    if (data.descripcionProducto)
      formData.append("descripcionProducto", data.descripcionProducto);

    if (data.sku)
      formData.append("sku", data.sku);

    if (data.productoActivo !== undefined)
      formData.append("productoActivo", String(data.productoActivo));

    if (data.imagen instanceof File)
      formData.append("imagen", data.imagen);

    if (!isEditing && data.stockInicial != null)
      formData.append("stockInicial", String(data.stockInicial));

    if (data.idBodega !== undefined && data.idBodega !== null)
      formData.append("idBodega", String(data.idBodega));

    // LOG FORM DATA
    console.log("📦 FORM DATA FINAL:");
    for (let pair of formData.entries()) {
      console.log(" ➜", pair[0], pair[1]);
    }

    // blindado final
    formData.delete("idProducto");
    formData.delete("urlImagenProducto");

    console.log("🧨 FORM DATA TRAS DELETE:");
    for (let pair of formData.entries()) {
      console.log(" ➜", pair[0], pair[1]);
    }

    await onSubmit(formData);
  };

  /* ===========================================================
     FORMULARIO COMPLETO
  ============================================================ */
  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 bg-white p-6 rounded-xl shadow-xl"
    >
      {/* Nombre */}
      <div>
        <label className="block font-semibold text-gray-700">Nombre del Producto</label>
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
        <label className="block font-semibold text-gray-700">Precio de Compra (CLP)</label>
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
          <option value="">Seleccione...</option>
          {bodegas.map((b) => (
            <option key={b.idBodega} value={b.idBodega}>
              {b.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Stock Inicial */}
      {!isEditing && (
        <div>
          <label className="block font-semibold text-gray-700">Stock Inicial</label>
          <input
            type="number"
            {...register("stockInicial", { valueAsNumber: true })}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="0"
          />
        </div>
      )}

      {/* Descripción */}
      <div>
        <label className="block font-semibold text-gray-700">Descripción</label>
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
        <label className="font-semibold text-gray-700">Producto Activo</label>
      </div>

      {/* Imagen */}
      <div>
        <label className="block font-semibold text-gray-700">Imagen del Producto</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setValue("imagen", e.target.files?.[0] || null)}
          className="block w-full text-sm"
        />

        {/* Errores */}
        {errors.imagen && (
          <p className="text-red-600 text-sm mt-1">
            {(errors.imagen as FieldError).message}
          </p>
        )}

        {/* Preview */}
        <div className="mt-4 flex space-x-4">
          {/* imagen actual */}
          {isEditing && imagePreviewUrl && !selectedImage && (
            <img
              src={imagePreviewUrl}
              className="w-32 h-32 object-cover rounded-lg border"
            />
          )}

          {/* imagen nueva */}
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
