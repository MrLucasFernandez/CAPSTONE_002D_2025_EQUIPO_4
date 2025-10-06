import { Categoria } from '../../categorias/entities/categoria.entity';
export class CreateProductoDto {
    nombreProducto: string;
    precioProducto: number;
    descripcionProducto?: string;
    productoActivo: boolean;
    sku?: string;
    idCategoria: Categoria;
}
export class UpdateProductoDto{
    nombreProducto?: string;
    precioProducto?: number;
    descripcionProducto?: string;
    sku?: string;
    idCategoria?: Categoria;
    productoActivo?: boolean;
}