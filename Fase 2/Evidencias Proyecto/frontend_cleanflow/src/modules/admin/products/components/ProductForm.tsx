import { useEffect } from "react";
import { useForm, type FieldErrors, type FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  productCreateSchema,
  productUpdateSchema,
  type ProductCreateData,
  type ProductUpdateData,
} from "../validations/product.schema";

import type { Categoria, Marca } from "../../../../types/product";

// Tipo final unificado (create + update)
export type FormFields = ProductCreateData & ProductUpdateData;

export interface ProductFormProps {
  isEditing?: boolean;
  initialValues: Partial<FormFields>;
  categorias: Categoria[];
  marcas: Marca[];
  onSubmit: (formData: FormData) => Promise<void>;

  // Función opcional: solo si queremos subir imagen
  uploadImageToCloudinary?: (
    imageFile: File
  ) => Promise<{ url: string; publicId: string }>;
}

export default function ProductForm({
  isEditing = false,
  initialValues,
  categorias,
  marcas,
  onSubmit,
  uploadImageToCloudinary,
}: ProductFormProps) {
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

  // Actualiza valores iniciales cuando llegan desde EditPage
  useEffect(() => {
    reset(initialValues as FormFields);
  }, [initialValues, reset]);

  const selectedImage = watch("imagen");

  // Renombra automáticamente el archivo antes de subirlo ("imagen.ext")
  function renameFile(originalFile: File, newBaseName: string): File {
    const ext = originalFile.name.split(".").pop() || "jpg";
    return new File([originalFile], `${newBaseName}.${ext}`, {
      type: originalFile.type,
      lastModified: originalFile.lastModified,
    });
  }

  const handleFormSubmit = async (data: FormFields) => {
    const formData = new FormData();
    let productData = data;

    // Subida de imagen: solo si se selecciona + existe la función de Cloudinary
    if (productData.imagen instanceof File && uploadImageToCloudinary) {
      try {
        const renamedFile = renameFile(productData.imagen, "imagen");
        const result = await uploadImageToCloudinary(renamedFile);

        productData = {
          ...productData,
          urlImagenProducto: result.url,
          publicIdImagen: result.publicId,
          imagen: undefined,
        };
      } catch {
        throw new Error("Fallo al subir la imagen del producto.");
      }
    }

    // Campos obligatorios en create y modificables en update
    if (productData.nombreProducto) {
      formData.append("nombreProducto", productData.nombreProducto);
    }

    // Manejo especial para precio (solo enviar si cambia en edición)
    const currentPrice = productData.precioCompraProducto;
    const initialPrice = initialValues.precioCompraProducto;
    const isPriceModified = isEditing && currentPrice !== initialPrice;
    const isCreating = !isEditing;

    if (
      (isCreating || isPriceModified) &&
      currentPrice !== undefined &&
      currentPrice !== null
    ) {
      formData.append("precioCompraProducto", String(currentPrice));
    }

    // Categoría / Marca
    if (productData.idCategoria !== undefined) {
      formData.append("idCategoria", String(productData.idCategoria));
    }
    if (productData.idMarca !== undefined) {
      formData.append("idMarca", String(productData.idMarca));
    }

    // Campos opcionales
    if (productData.descripcionProducto)
      formData.append("descripcionProducto", productData.descripcionProducto);

    if (productData.sku) formData.append("sku", productData.sku);

    if (productData.productoActivo !== undefined)
      formData.append("productoActivo", String(productData.productoActivo));

    // Imagen cloudinary (solo si ya venía o se agregó una)
    if (productData.publicIdImagen) {
      formData.append("publicIdImagen", productData.publicIdImagen);
    }

    if (productData.urlImagenProducto) {
      formData.append("urlImagenProducto", productData.urlImagenProducto);
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
        <label htmlFor="nombreProducto" className="block font-semibold text-gray-700">
          Nombre del Producto
        </label>
        <input
          id="nombreProducto"
          {...register("nombreProducto")}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="Ej: Limpiador Multiuso"
        />
        {errors.nombreProducto && (
          <p className="text-red-600 text-sm mt-1">
            {(errors.nombreProducto as FieldError).message as string}
          </p>
        )}
      </div>

      {/* Precio */}
      <div>
        <label htmlFor="precioCompraProducto" className="block font-semibold text-gray-700">
          Precio de Compra (CLP)
        </label>
        <input
          id="precioCompraProducto"
          type="number"
          {...register("precioCompraProducto", { valueAsNumber: true })}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="0"
        />
        {errors.precioCompraProducto && (
          <p className="text-red-600 text-sm mt-1">
            {((errors as FieldErrors<FormFields>).precioCompraProducto as FieldError)
              ?.message as string}
          </p>
        )}
      </div>

      {/* Categoría */}
      <div>
        <label htmlFor="idCategoria" className="block font-semibold text-gray-700">
          Categoría
        </label>
        <select
          id="idCategoria"
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
        {errors.idCategoria && (
          <p className="text-red-600 text-sm mt-1">
            {(errors.idCategoria as FieldError).message as string}
          </p>
        )}
      </div>

      {/* Marca */}
      <div>
        <label htmlFor="idMarca" className="block font-semibold text-gray-700">
          Marca
        </label>
        <select
          id="idMarca"
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
        {errors.idMarca && (
          <p className="text-red-600 text-sm mt-1">
            {(errors.idMarca as FieldError).message as string}
          </p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="descripcionProducto" className="block font-semibold text-gray-700">
          Descripción
        </label>
        <textarea
          id="descripcionProducto"
          {...register("descripcionProducto")}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      {/* SKU */}
      <div>
        <label htmlFor="sku" className="block font-semibold text-gray-700">
          SKU (Opcional)
        </label>
        <input
          id="sku"
          {...register("sku")}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Activo */}
      <div className="flex items-center space-x-2">
        <input
          id="productoActivo"
          type="checkbox"
          {...register("productoActivo")}
          className="w-4 h-4"
        />
        <label htmlFor="productoActivo" className="font-semibold text-gray-700">
          Producto Activo
        </label>
      </div>

      {/* Imagen */}
      <div>
        <label htmlFor="imagen" className="block font-semibold text-gray-700">
          Cargar Imagen {isEditing ? "(Reemplazar)" : ""}
        </label>
        <input
          id="imagen"
          type="file"
          accept="image/*"
          onChange={(e) => {
            setValue("imagen", e.target.files?.[0]);
          }}
          className="block w-full text-sm"
        />

        {errors.imagen && (
          <p className="text-red-600 text-sm mt-1">
            {(errors.imagen as FieldError).message as string}
          </p>
        )}

        {/* Imagen actual o preview */}
        <div className="mt-4 flex space-x-4">
          {isEditing && initialValues.urlImagenProducto && !selectedImage && (
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
