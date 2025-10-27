import { Categoria } from '../../categorias/entities/categoria.entity';
import { Marca } from '../../marcas/entities/marca.entity';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductoDto {
    @IsNotEmpty()
    @IsString()
    nombreProducto: string;
    
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    precioProducto: number;

    @IsOptional()
    @IsString()
    descripcionProducto?: string;

    @IsOptional()
    @IsNotEmpty()
    productoActivo: boolean;

    @IsOptional()
    @IsString()
    sku?: string;

    @IsNotEmpty()
    idCategoria: Categoria;

    @IsNotEmpty()
    idMarca: Marca;

    @IsOptional()
    @IsNumber()
    @Min(0)
    stockInicial?: number;

    @IsOptional()
    @IsNumber()
    idBodega?: number;
}


export class UpdateProductoDto{

    @IsOptional()
    @IsString()
    nombreProducto?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    precioProducto?: number;

    @IsOptional()
    @IsString()
    descripcionProducto?: string;

    @IsOptional()
    @IsString()
    sku?: string;

    @IsOptional()
    idCategoria?: Categoria;

    @IsOptional()
    productoActivo?: boolean;

    @IsOptional()
    idMarca?: Marca;

    @IsOptional()
    @IsNumber()
    @Min(0)
    stock?: number;

    @IsOptional()
    @IsNumber()
    idBodega?: number;
}