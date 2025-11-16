import { z } from "zod";

// =======================================================
// BASE — Reglas Comunes de Tipo y Longitud
// =======================================================
export const productSchemaBase = z.object({
  // CLAVES FORÁNEAS
  idCategoria: z.coerce
    // CORRECCIÓN: Usar 'message' en lugar de 'invalid_type_error'
    .number({ message: "Seleccione una categoría" }) 
    .int("Seleccione una categoría")
    .min(1, "Seleccione una categoría válida"),

  idMarca: z.coerce
    // CORRECCIÓN: Usar 'message' en lugar de 'invalid_type_error'
    .number({ message: "Seleccione una marca" })
    .int("Seleccione una marca")
    .min(1, "Seleccione una marca válida"),

  // CAMPO DE PRECIO
  precioCompraProducto: z.coerce
    // CORRECCIÓN: Usar 'message' en lugar de 'invalid_type_error'
    .number({ message: "El precio de compra es obligatorio" }) 
    .int("El precio de compra debe ser un número entero"),

  // CAMPOS DE PRODUCTO
  nombreProducto: z
    .string()
    .nonempty("El nombre es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres"),

  descripcionProducto: z.string().max(100, "La descripción no puede superar los 100 caracteres").nullish(),
  sku: z.string().max(50, "El SKU no puede superar los 50 caracteres").nullish(),
  productoActivo: z.coerce.boolean().optional(),

  // IMÁGENES
  urlImagenProducto: z.string().max(200, "La URL no puede superar los 200 caracteres").url("Debe ser una URL válida").nullish(),
  publicIdImagen: z.string().max(200, "El ID de imagen no puede superar los 200 caracteres").nullish(),
  imagen: z.any().nullish(), 
});

// =======================================================
// CREATE — Esquema para POST /productos
// =======================================================
export const productCreateSchema = productSchemaBase
  .refine(data => data.precioCompraProducto >= 1, {
    message: "El precio de compra debe ser mayor a 0",
    path: ["precioCompraProducto"],
  })
  .refine(data => data.imagen !== undefined && data.imagen !== null, {
    message: "La imagen es obligatoria al crear un producto",
    path: ["imagen"],
  });


// =======================================================
// UPDATE — Esquema para PUT/PATCH /productos/:id
// =======================================================
export const productUpdateSchema = productSchemaBase.partial().extend({
    // Nombre y FKs se hacen opcionales
    nombreProducto: z.string().min(3).max(50).optional(),
    idCategoria: z.number().int().min(1).optional(),
    idMarca: z.number().int().min(1).optional(),

    // Precio de compra opcional en update
    precioCompraProducto: z.coerce
        // CORRECCIÓN: Usar 'message' en lugar de 'invalid_type_error'
        .number({ message: "El precio de compra debe ser un número" }) 
        .int("El precio de compra debe ser un número entero")
        .min(0, "El precio debe ser cero o mayor")
        .optional(),
    
    imagen: z.any().nullish(),
});


// =======================================================
// Tipos inferidos
// =======================================================
export type ProductCreateData = z.infer<typeof productCreateSchema>;
export type ProductUpdateData = z.infer<typeof productUpdateSchema>;