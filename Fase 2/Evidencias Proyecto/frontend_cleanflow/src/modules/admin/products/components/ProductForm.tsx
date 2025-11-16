import { useEffect } from "react";
import { useForm, type FieldErrors, type FieldError } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod";
//import { z } from "zod";

import {
  productCreateSchema,
  productUpdateSchema,
} from "../validations/product.schema";

import type { Categoria, Marca } from "../../../../types/product";

import type {
  ProductCreateData,
  ProductUpdateData,
} from "../validations/product.schema";

// Tipo de los datos que potencialmente existen en el formulario (intersección)
type FormFields = ProductCreateData & ProductUpdateData; 

// Props
export interface ProductFormProps {
  isEditing?: boolean;
  initialValues: Partial<FormFields>; 
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
  // useForm
  // ----------------------------------------------------
  const methods = useForm<FormFields>({ 
    // SOLUCIÓN: Usamos 'as any' en el resolver para evitar los errores de sobrecarga
    // de TypeScript con la unión de esquemas, manteniendo la seguridad de tipos en FormFields.
    resolver: zodResolver(schema as any),
    
    // El casting a FormFields asegura la compatibilidad.
    defaultValues: initialValues as FormFields, 
  });
  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue, // Usamos setValue para manejar archivos
    formState: { errors, isSubmitting },
  } = methods;

  // Efecto para actualizar valores iniciales (fundamental para el modo edición)
  useEffect(() => {
    reset(initialValues as FormFields); 
  }, [initialValues, reset]);

  // Preview imagen
  const selectedImage = watch("imagen");

  // Submit
  const handleFormSubmit = async (data: FormFields) => {
    const formData = new FormData();
    const productData = data; 

    // --- Campos Base ---

    if (productData.nombreProducto) {
        formData.append("nombreProducto", productData.nombreProducto);
    }

    // CRÍTICO: Solo se envía el precio de compra, ya que la BD genera el resto.
    if (productData.precioCompraProducto !== undefined && productData.precioCompraProducto !== null) {
        formData.append(
          "precioCompraProducto",
          String(productData.precioCompraProducto)
        );
    }
    
    if (productData.idCategoria !== undefined) {
        formData.append("idCategoria", String(productData.idCategoria));
    }
    if (productData.idMarca !== undefined) {
        formData.append("idMarca", String(productData.idMarca));
    }
    
    // --- Campos Opcionales ---

    if (productData.descripcionProducto)
      formData.append("descripcionProducto", productData.descripcionProducto);

    if (productData.sku) formData.append("sku", productData.sku);

    if (productData.productoActivo !== undefined)
      formData.append("productoActivo", String(productData.productoActivo));
      
    // --- Gestión de Imagen ---
    
    // Adjuntar archivo de imagen si existe
    if (productData.imagen instanceof File) {
      formData.append("imagen", productData.imagen);
    }

    // Incluir IDs/URLs si existen (esencial para referenciar/eliminar en UPDATE)
    if (productData.publicIdImagen) {
        formData.append("publicIdImagen", productData.publicIdImagen);
    }
    
    if (productData.urlImagenProducto) {
        formData.append("urlImagenProducto", productData.urlImagenProducto);
    }
    
    await onSubmit(formData);
  };

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 bg-white p-6 rounded-xl shadow-xl"
    >
      {/* Nombre */}
      <div>
        <label htmlFor="nombreProducto" className="block font-semibold text-gray-700">Nombre del Producto</label>
        <input 
          id="nombreProducto" 
          {...register("nombreProducto")} 
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" 
          placeholder="Ej: Limpiador Multiuso"
        />
        {errors.nombreProducto && (
          <p className="text-red-600 text-sm mt-1">
            {(errors.nombreProducto as FieldError).message as string}
          </p>
        )}
      </div>

      {/* Precio de Compra (Se renderiza en ambos modos) */}
      <div>
        <label htmlFor="precioCompraProducto" className="block font-semibold text-gray-700">Precio de Compra (CLP)</label>
        <input
          id="precioCompraProducto"
          type="number"
          {...register("precioCompraProducto", { valueAsNumber: true })} 
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
          placeholder="0"
        />
        {(errors.precioCompraProducto) && (
          <p className="text-red-600 text-sm mt-1">
            {((errors as FieldErrors<FormFields>).precioCompraProducto as FieldError)?.message as string}
          </p>
        )}
      </div>

      {/* Categoría */}
      <div>
        <label htmlFor="idCategoria" className="block font-semibold text-gray-700">Categoría</label>
        <select 
          id="idCategoria" 
          {...register("idCategoria", { valueAsNumber: true })} 
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition appearance-none"
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
        <label htmlFor="idMarca" className="block font-semibold text-gray-700">Marca</label>
        <select 
          id="idMarca" 
          {...register("idMarca", { valueAsNumber: true })} 
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition appearance-none"
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
        <label htmlFor="descripcionProducto" className="block font-semibold text-gray-700">Descripción (Opcional)</label>
        <textarea 
          id="descripcionProducto" 
          {...register("descripcionProducto")} 
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" 
          rows={3} 
        />
      </div>

      {/* SKU */}
      <div>
        <label htmlFor="sku" className="block font-semibold text-gray-700">SKU (Opcional)</label>
        <input 
          id="sku" 
          {...register("sku")} 
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" 
        />
      </div>

      {/* Producto Activo (Checkbox) */}
      <div className="flex items-center space-x-2">
        <input 
          id="productoActivo" 
          type="checkbox" 
          {...register("productoActivo")} 
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="productoActivo" className="font-semibold text-gray-700">Producto Activo</label>
      </div>

      {/* Imagen */}
      <div>
        <label htmlFor="imagen" className="block font-semibold text-gray-700">Cargar Imagen {isEditing ? "(Reemplazar)" : ""}</label>
        <input 
          id="imagen" 
          type="file" 
          accept="image/*" 
          {...register("imagen", { 
              onChange: (e) => { 
                // Usamos setValue directamente para actualizar el valor del campo 'imagen'
                setValue("imagen", e.target.files?.[0]);
              }
          })} 
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        {errors.imagen && (
            <p className="text-red-600 text-sm mt-1">
              {(errors.imagen as FieldError).message as string}
            </p>
          )}
        
        {/* Visualización de la imagen actual o preview */}
        <div className="mt-4 flex space-x-4">
            {/* Imagen actual de la BD (si estamos editando y no hay nueva selección) */}
            {isEditing && initialValues.urlImagenProducto && !selectedImage && (
              <img
                src={initialValues.urlImagenProducto}
                alt="Imagen actual"
                className="w-32 h-32 object-cover rounded-lg shadow border border-gray-200"
              />
            )}

            {/* Preview de la nueva imagen */}
            {selectedImage instanceof File && (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview de la imagen"
                className="w-32 h-32 object-cover rounded-lg shadow border-2 border-green-400"
              />
            )}
        </div>
      </div>

      {/* Botón */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-150 disabled:bg-blue-400"
      >
        {isSubmitting ? "Enviando..." : (isEditing ? "Actualizar Producto" : "Crear Producto")}
      </button>
    </form>
  );
}