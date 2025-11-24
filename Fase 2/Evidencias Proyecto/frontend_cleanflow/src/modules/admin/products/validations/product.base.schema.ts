import { z } from "zod";

export const productBaseSchema = z.object({
    idCategoria: z.coerce
        .number({ message: "Seleccione una categoría" })
        .int()
        .min(1, "Seleccione una categoría válida"),

    idMarca: z.coerce
        .number({ message: "Seleccione una marca" })
        .int()
        .min(1, "Seleccione una marca válida"),

    precioCompraProducto: z.coerce
        .number({ message: "El precio es obligatorio" })
        .min(0, "El precio no puede ser negativo"),

    nombreProducto: z
        .string()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(50, "El nombre no puede superar 50 caracteres"),

    descripcionProducto: z.string().max(200).nullish(),

    sku: z.string().max(50).nullish(),

    productoActivo: z.coerce.boolean().optional(),

    // Imagen
    urlImagenProducto: z.string().url().nullish(),
    publicIdImagen: z.string().nullish(),
    imagen: z.any().nullish(),

    // Stock y Bodega (opcionales aquí)
    stockInicial: z.coerce.number().min(0).optional(),
    idBodega: z.coerce.number().min(1).optional(),
});

export type ProductBaseData = z.infer<typeof productBaseSchema>;
