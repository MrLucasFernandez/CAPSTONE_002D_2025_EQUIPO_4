// src/components/organisms/admin/ProductFormBuilder/ProductFormBuilder.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// UI
import Modal from '@components/ui/Modal';
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
  // acepta FormData (cuando hay imagen) o un objeto JSON cuando no hay imagen
  onSubmit: (payload: FormData | Record<string, any>) => Promise<void>;
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
    getValues,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: { ...initialValues, removeImagen: false },
  });

  // Reset automático si cambian valores iniciales
  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  // Imagen seleccionada (la que eliges en el input file)
  const selectedImage = watch("imagen");

  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  // ------------------------------ GENERAR SKU AUTOMÁTICO ------------------------------
  const generateSKU = () => {
    const nombreProducto = watch("nombreProducto");
    if (!nombreProducto || nombreProducto.trim() === "") {
      alert("Por favor, ingresa un nombre de producto primero");
      return;
    }

    // Tomar las primeras palabras del nombre (máximo 3)
    const palabras = nombreProducto
      .trim()
      .toUpperCase()
      .split(/\s+/)
      .slice(0, 3);

    // Tomar las primeras 3 letras de cada palabra
    const prefijo = palabras
      .map((palabra: string) => palabra.substring(0, 3))
      .join("");

    // Generar un número aleatorio de 4 dígitos
    const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);

    // Formato final: PREFIJO-NUMERO (ej: LIMPIADOR-5432)
    const sku = `${prefijo}-${numeroAleatorio}`;
    
    setValue("sku", sku, { shouldDirty: true, shouldValidate: true });
  };

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

    // Stock: enviar `stockInicial` al crear, o `stock` al editar
    if (!isEditing) {
      append("stockInicial", data.stockInicial);
    } else {
      append("stock", data.stock);
    }

    append("idBodega", data.idBodega);

    // Imagen si se seleccionó una nueva (este es el campo importante)
    if (data.imagen instanceof File) {
      fd.append("imagen", data.imagen);
    }

    // Si el usuario solicitó remover la imagen existente
    const removeImagen = getValues("removeImagen");
    if (removeImagen) {
      fd.append("removeImagen", "1");
    }

    // Si NO hay imagen nueva y no se solicitó remover la imagen, podemos enviar JSON
    const hasNewImage = data.imagen instanceof File;
    if (!hasNewImage && !removeImagen) {
      const payload: Record<string, any> = {};
      const safeAppend = (k: string, v: any) => {
        if (v !== undefined && v !== null && v !== "") payload[k] = v;
      };

      safeAppend("nombreProducto", data.nombreProducto);
      safeAppend("precioCompraProducto", Number(data.precioCompraProducto));
      safeAppend("idCategoria", Number(data.idCategoria));
      safeAppend("idMarca", Number(data.idMarca));
      safeAppend("descripcionProducto", data.descripcionProducto);
      safeAppend("sku", data.sku);
      // enviar booleano real para evitar que 'false' string sea truthy
      safeAppend("productoActivo", !!data.productoActivo);

      if (!isEditing) safeAppend("stockInicial", Number(data.stockInicial ?? 0));
      else safeAppend("stock", Number(data.stock ?? 0));

      safeAppend("idBodega", Number(data.idBodega));

      if (getValues("removeImagen")) safeAppend("removeImagen", true);

      console.log("📦 PAYLOAD JSON FINAL:", payload);
      await onSubmit(payload);
      return;
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

        {/* Stock: inicial en create, editable en edit */}
        {!isEditing ? (
          <AdminInput
            label="Stock inicial"
            type="number"
            placeholder="0"
            error={(errors.stockInicial as FieldError)?.message}
            {...register("stockInicial", { valueAsNumber: true })}
          />
        ) : (
          <AdminInput
            label="Stock"
            type="number"
            placeholder="0"
            error={(errors.stock as FieldError)?.message}
            {...register("stock", { valueAsNumber: true })}
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
        <div className="relative">
          <AdminInput
            label="SKU"
            error={(errors.sku as FieldError)?.message}
            {...register("sku")}
          />
          <button
            type="button"
            onClick={generateSKU}
            className="absolute right-2 top-9 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Generar
          </button>
        </div>

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
          onFileSelect={(file) => {
            setValue("imagen", file, { shouldValidate: true });
            // si se selecciona un archivo nuevo aseguramos que no esté marcada la eliminación
            if (file) setValue("removeImagen", false);
          }}
          onRemove={() => {
            setValue("imagen", null);
            setValue("removeImagen", true);
          }}
        />
        
        <div className="flex items-center gap-3">
          <AdminButton
            type="button"
            variant="secondary"
            onClick={() => {
              if (isDirty) {
                setConfirmOpen(true);
                return;
              }
              navigate("/admin/productos");
            }}
            size="md"
          >
            Cancelar
          </AdminButton>

          <AdminButton loading={isSubmitting} className="flex-1">
            {submitLabel}
          </AdminButton>
        </div>

        {/* Confirmación si hay cambios sin guardar */}
        <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirmar cancelación" width="max-w-md">
          <p className="text-gray-700">Hay cambios sin guardar. ¿Seguro que quieres cancelar y perder los cambios?</p>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => setConfirmOpen(false)} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">Seguir editando</button>
            <button onClick={() => { setConfirmOpen(false); navigate('/admin/productos'); }} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Cancelar y salir</button>
          </div>
        </Modal>
      </form>
    </AdminCard>
  );
}
