import { z } from "zod";
import { productBaseSchema } from "./product.base.schema";

export const productCreateSchema = productBaseSchema
    .refine((d) => d.precioCompraProducto > 0, {
        message: "El precio debe ser mayor a 0",
        path: ["precioCompraProducto"],
    })
    .refine((d) => d.imagen instanceof File, {
        message: "Debe subir una imagen",
        path: ["imagen"],
    })
    .refine((d) => d.stockInicial != null && d.stockInicial >= 0, {
        message: "Debe ingresar un stock inicial válido",
        path: ["stockInicial"],
    })
    .refine((d) => d.idBodega != null, {
        message: "Debe seleccionar una bodega",
        path: ["idBodega"],
    });

export type ProductCreateData = z.infer<typeof productCreateSchema>;
