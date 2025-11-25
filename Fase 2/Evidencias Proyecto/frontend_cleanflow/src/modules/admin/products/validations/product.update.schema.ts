import { z } from "zod";
import { productBaseSchema } from "./product.base.schema";

export const productUpdateSchema = productBaseSchema
    .partial()
    .extend({
    nombreProducto: z.string().min(3).max(50).optional(),
    idCategoria: z.coerce.number().min(1).optional(),
    idMarca: z.coerce.number().min(1).optional(),

    precioCompraProducto: z.coerce
        .number({ message: "El precio debe ser un número" })
        .min(0, "El precio no puede ser negativo")
        .optional(),

        imagen: z.any().nullish(),
    });

// para update NO se acepta stockInicial ni es obligatorio idBodega
export type ProductUpdateData = z.infer<typeof productUpdateSchema>;
