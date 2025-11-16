import { useEffect } from "react";
// Importar FieldError para el casting del mensaje de error
import { useForm, type FieldErrors, type FieldError } from "react-hook-form"; 
//import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  productCreateSchema,
  productUpdateSchema,
} from "../validations/product.schema";

import type { Categoria, Marca } from "../../../../types/product";

// 👉 Tipos separados
import type {
  ProductCreateData,
  ProductUpdateData,
} from "../validations/product.schema";

// Props
export interface ProductFormProps {
  isEditing?: boolean;
  initialValues: Partial<ProductCreateData & ProductUpdateData>;
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
  // -------------------------------
  // Resolver dinámico
  // -------------------------------
  const schema = isEditing ? productUpdateSchema : productCreateSchema;

  // ----------------------------------------------------
  // Definir FormType con inferencia condicional
  // ----------------------------------------------------
  type FormType = typeof isEditing extends true 
      ? ProductUpdateData 
      : ProductCreateData;


  // ----------------------------------------------------
  // useForm
  // ----------------------------------------------------
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  // Usar useForm con dos genéricos para el contexto
  } = useForm<FormType, any>({ 
    // Casting 'as any' en el esquema dinámico (solución al error 2769)
    resolver: zodResolver<FormType, {}, FormType>(schema as any),
    
    // Casting seguro
    defaultValues: initialValues as FormType, 
  });

  // Cambian valores iniciales
  useEffect(() => {
    reset(initialValues as FormType); 
  }, [initialValues, reset]);

  // Preview imagen
  const selectedImage = watch("imagen");

  // Submit
  const handleFormSubmit = async (data: FormType) => {
    const formData = new FormData();

    // Casting a la intersección para acceder a propiedades comunes sin errores TS
    const productData = data as ProductCreateData & ProductUpdateData;

    formData.append("nombreProducto", productData.nombreProducto);

    // Asegurarse de que los campos numéricos se conviertan a string para FormData
    formData.append(
      "precioCompraProducto",
      String(productData.precioCompraProducto ?? 0)
    );
    
    formData.append("idCategoria", String(productData.idCategoria));
    formData.append("idMarca", String(productData.idMarca));

    if (productData.descripcionProducto)
      formData.append("descripcionProducto", productData.descripcionProducto);

    if (productData.sku) formData.append("sku", productData.sku);

    if (productData.productoActivo !== undefined)
      formData.append("productoActivo", String(productData.productoActivo));

    // Solo en update
    if (isEditing) {
      if (productData.precioProducto !== undefined)
        formData.append("precioProducto", String(productData.precioProducto));

      if (productData.precioVentaProducto !== undefined)
        formData.append(
          "precioVentaProducto",
          String(productData.precioVentaProducto)
        );
    }

    if (productData.imagen instanceof File) {
      formData.append("imagen", productData.imagen);
    }

    await onSubmit(formData);
  };

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 bg-white p-6 rounded shadow-lg"
    >
      {/* Nombre */}
      <div>
        <label className="block font-semibold">Nombre</label>
        <input {...register("nombreProducto")} className="w-full p-2 border rounded" />
        {errors.nombreProducto && (
          <p className="text-red-600 text-sm">
            {(errors.nombreProducto as FieldError).message as string}
          </p>
        )}
      </div>

      {/* Precio Compra solo CREATE */}
      {!isEditing && (
        <div>
          <label className="block font-semibold">Precio de Compra</label>
          <input
            type="number"
            {...register("precioCompraProducto")} 
            className="w-full p-2 border rounded"
          />
          {/* Casting para acceder a errores condicionales */}
          {(errors as FieldErrors<ProductCreateData>).precioCompraProducto && (
            <p className="text-red-600 text-sm">
              {((errors as FieldErrors<ProductCreateData>).precioCompraProducto as FieldError).message as string}
            </p>
          )}
        </div>
      )}

      {/* Categoría */}
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
            <p className="text-red-600 text-sm">
              {(errors.idCategoria as FieldError).message as string}
            </p>
          )}
      </div>

      {/* Marca */}
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
            <p className="text-red-600 text-sm">
              {(errors.idMarca as FieldError).message as string}
            </p>
          )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block font-semibold">Descripción</label>
        <textarea {...register("descripcionProducto")} className="w-full p-2 border rounded" />
      </div>

      {/* SKU */}
      <div>
        <label className="block font-semibold">SKU</label>
        <input {...register("sku")} className="w-full p-2 border rounded" />
      </div>

      {/* Imagen */}
      <div>
        <label className="block font-semibold">Imagen</label>
        <input type="file" accept="image/*" {...register("imagen")} />

        {/* Mensaje de error de imagen (solo CREATE) */}
        {errors.imagen && (
            <p className="text-red-600 text-sm">
              {(errors.imagen as FieldError).message as string}
            </p>
          )}
        
        {/* Imagen actual */}
        {initialValues.urlImagenProducto && !selectedImage && (
          <img
            src={initialValues.urlImagenProducto}
            className="w-32 mt-2 rounded"
          />
        )}

        {/* Preview */}
        {selectedImage instanceof File && (
          <img
            src={URL.createObjectURL(selectedImage)}
            className="w-32 mt-2 rounded"
          />
        )}
      </div>

      {/* Botón */}
      <button
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {isEditing ? "Actualizar" : "Crear Producto"}
      </button>
    </form>
  );
}