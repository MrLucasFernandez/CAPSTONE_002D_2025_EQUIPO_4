import { z } from "zod";

// -------------------------------------------------------
// BASE — Campos comunes entre CREATE y UPDATE
// -------------------------------------------------------
export const productSchemaBase = z.object({
  nombreProducto: z
    // ✅ CORRECCIÓN 1: Usar .nonempty() para el mensaje de campo vacío/obligatorio,
    // y eliminar el objeto de error de tipo si no es estrictamente necesario,
    // o usar .refine() para tipos específicos.
    .string() 
    .nonempty("El nombre es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres"),

  idCategoria: z.coerce
    // ✅ CORRECCIÓN 2: Usar .number({ message: "..." }) para error de tipo general
    .number({ message: "Seleccione una categoría" })
    .min(1, "Seleccione una categoría válida"),

  idMarca: z.coerce
    // ✅ CORRECCIÓN 3: Usar .number({ message: "..." })
    .number({ message: "Seleccione una marca" })
    .min(1, "Seleccione una marca válida"),

  descripcionProducto: z.string().max(100).nullish(),
  sku: z.string().max(50).nullish(),

  productoActivo: z.coerce.boolean().optional(),

  imagen: z.any().nullish(),

  urlImagenProducto: z.string().nullish(),
  publicIdImagen: z.string().nullish(),
});

// -------------------------------------------------------
// CREATE — incluye PRECIO COMPRA obligatorio
// -------------------------------------------------------
export const productCreateSchema = productSchemaBase
  .extend({
    precioCompraProducto: z.coerce
      // ✅ CORRECCIÓN 4: Usar .number({ message: "..." })
      .number({ message: "El precio de compra es obligatorio" })
      .min(1, "El precio debe ser mayor a 0"),
  })
  .superRefine((data, ctx) => {
    if (!data.imagen) {
      ctx.addIssue({
        code: "custom",
        message: "La imagen es obligatoria al crear un producto",
        path: ["imagen"],
      });
    }
  });

// -------------------------------------------------------
// UPDATE — NO usa precioCompraProducto
// pero SÍ requiere precioProducto y precioVentaProducto
// -------------------------------------------------------
export const productUpdateSchema = productSchemaBase
  .extend({
    precioProducto: z.coerce
      // ✅ CORRECCIÓN 5: Usar .number({ message: "..." })
      .number({ message: "El precio del producto es obligatorio" }),

    precioVentaProducto: z.coerce
      // ✅ CORRECCIÓN 6: Usar .number({ message: "..." })
      .number({ message: "El precio de venta es obligatorio" }),
  })
  .superRefine((data, ctx) => {
    if (data.precioProducto == null || isNaN(data.precioProducto)) {
      ctx.addIssue({
        code: "custom",
        message: "El precio del producto es obligatorio",
        path: ["precioProducto"],
      });
    }
    if (data.precioVentaProducto == null || isNaN(data.precioVentaProducto)) {
      ctx.addIssue({
        code: "custom",
        message: "El precio de venta es obligatorio",
        path: ["precioVentaProducto"],
      });
    }
  });

// -------------------------------------------------------
export type ProductFormData = z.infer<typeof productSchemaBase>;
export type ProductCreateData = z.infer<typeof productCreateSchema>;
export type ProductUpdateData = z.infer<typeof productUpdateSchema>;