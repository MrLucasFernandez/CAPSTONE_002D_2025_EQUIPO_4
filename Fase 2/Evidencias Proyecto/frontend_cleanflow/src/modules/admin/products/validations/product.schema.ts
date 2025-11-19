import { z } from "zod";

// =======================================================
// BASE — Reglas Comunes para Create + Update
// =======================================================
export const productSchemaBase = z.object({
  // FK Categoría
  idCategoria: z.coerce
    .number({ message: "Seleccione una categoría" })
    .int("Seleccione una categoría válida")
    .min(1, "Seleccione una categoría válida"),

  // FK Marca
  idMarca: z.coerce
    .number({ message: "Seleccione una marca" })
    .int("Seleccione una marca válida")
    .min(1, "Seleccione una marca válida"),

  // Precio de compra
  precioCompraProducto: z.coerce
    .number({ message: "El precio de compra es obligatorio" })
    .min(0, "El precio no puede ser negativo"),

  // Nombre
  nombreProducto: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres"),

  descripcionProducto: z.string().max(100).nullish(),
  sku: z.string().max(50).nullish(),
  productoActivo: z.coerce.boolean().optional(),

  // Imagenes
  urlImagenProducto: z.string().max(200).url().nullish(),
  publicIdImagen: z.string().max(200).nullish(),
  imagen: z.any().nullish(),

  // 🔵 NUEVO → CAMPOS PARA STOCK Y BODEGA
  stockInicial: z.coerce
    .number()
    .min(0, "El stock inicial no puede ser negativo")
    .optional(),

  idBodega: z.coerce
    .number()
    .min(1, "Seleccione una bodega")
    .optional(),
});

// =======================================================
// CREATE — POST /productos
// =======================================================
export const productCreateSchema = productSchemaBase
  .refine((data) => data.precioCompraProducto > 0, {
    message: "El precio de compra debe ser mayor a 0",
    path: ["precioCompraProducto"],
  })
  .refine((data) => data.imagen !== undefined && data.imagen !== null, {
    message: "La imagen es obligatoria al crear un producto",
    path: ["imagen"],
  })
  .refine((data) => data.stockInicial !== undefined, {
    message: "Debe ingresar el stock inicial",
    path: ["stockInicial"],
  })
  .refine((data) => data.idBodega !== undefined, {
    message: "Debe seleccionar una bodega",
    path: ["idBodega"],
  });

// =======================================================
// UPDATE — PUT /productos/:id
// =======================================================
export const productUpdateSchema = productSchemaBase.partial().extend({
  nombreProducto: z.string().min(3).max(50).optional(),

  idCategoria: z.coerce.number().min(1).optional(),
  idMarca: z.coerce.number().min(1).optional(),
  
  precioCompraProducto: z.coerce
    .number({ message: "El precio debe ser un número" })
    .min(0, "El precio no puede ser negativo")
    .optional(),

  // Imagen opcional
  imagen: z.any().nullish(),
});

// =======================================================
// Tipos inferidos
// =======================================================
export type ProductCreateData = z.infer<typeof productCreateSchema>;
export type ProductUpdateData = z.infer<typeof productUpdateSchema>;
