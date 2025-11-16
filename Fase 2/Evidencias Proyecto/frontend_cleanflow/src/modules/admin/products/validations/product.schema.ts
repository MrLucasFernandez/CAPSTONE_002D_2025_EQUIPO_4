import { z } from "zod";

export const productSchemaBase = z.object({
  nombreProducto: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres"),

  precioCompraProducto: z.coerce
    .number()
    .min(1, "El precio debe ser mayor a 0"),

  idCategoria: z.coerce
    .number()
    .min(1, "Seleccione una categoría válida"),

  idMarca: z.coerce
    .number()
    .min(1, "Seleccione una marca válida"),

  descripcionProducto: z
    .string()
    .max(100, "Máximo 100 caracteres")
    .optional(),

  sku: z.string().max(50).optional(),

  productoActivo: z.coerce.boolean().optional(),

  imagen: z.any().optional(),
});

export const productCreateSchema = productSchemaBase.superRefine((data, ctx) => {
  if (!data.imagen) {
    ctx.addIssue({
      code: "custom",
      message: "La imagen es obligatoria al crear un producto",
      path: ["imagen"],
    });
  }
});

export const productUpdateSchema = productSchemaBase;

export type ProductFormData = z.infer<typeof productSchemaBase>;
