import { Categoria } from '../../categorias/entities/categoria.entity';
import { Marca } from '../../marcas/entities/marca.entity';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductoDto {

    @ApiProperty({ example: 'Cloro Clorinda 500 ml', description: 'Nombre del producto' })
    @IsNotEmpty()
    @IsString({ message: 'El nombre del producto debe ser una cadena de texto' })
    nombreProducto: string;
    
    @ApiProperty({ example: 1500, description: 'Precio de compra del producto' })
    @IsNotEmpty()
    @IsNumber({}, { message: 'El precio de compra del producto debe ser un número' })
    @Min(0, { message: 'El precio de compra del producto no puede ser negativo' })
    precioCompraProducto: number;
    
    @ApiProperty({ example: 'Producto desinfectante para uso doméstico', description: 'Descripción del producto' })
    @IsOptional()
    @IsString({ message: 'La descripción del producto debe ser una cadena de texto' })
    descripcionProducto?: string;

    @ApiProperty({ example: true, description: 'Indica si el producto está activo o no' })
    @IsOptional()
    @IsNotEmpty({ message: 'El estado del producto no puede estar vacío' })
    productoActivo: boolean;

    @ApiProperty({ example: 'http://example.com/imagen.jpg', description: 'URL de la imagen del producto' })
    @IsOptional()
    @IsString({ message: 'La URL de la imagen del producto debe ser una cadena de texto' })
    urlImagenProducto?: string;

    @ApiProperty({ example: 1, description: 'ID de la imagen almacenada en Cloudinary'})
    @IsOptional()
    @IsString({ message: 'El ID de la imagen debe ser una cadena de texto' })
    publicId?: string

    @ApiProperty({ example: 'CLO-500ML-CLORINDA', description: 'SKU del producto' })
    @IsOptional()
    @IsString({ message: 'El SKU del producto debe ser una cadena de texto' })
    sku?: string;

    @ApiProperty({ example: 1, description: 'ID de la categoría asociada al producto' })
    @IsNotEmpty()
    idCategoria: Categoria;

    @ApiProperty({ example: 1, description: 'ID de la marca asociada al producto' })
    @IsNotEmpty()
    idMarca: Marca;

    @ApiProperty({ example: 100, description: 'Stock inicial del producto' })
    @IsOptional()
    @IsNumber({}, { message: 'El stock inicial debe ser un número' })
    @Min(0, { message: 'El stock inicial no puede ser negativo' })
    stockInicial?: number;

    @ApiProperty({ example: 1, description: 'ID de la bodega donde se almacena el producto' })
    @IsOptional()
    @IsNumber({}, { message: 'El ID de la bodega debe ser un número' })
    idBodega?: number;
}


export class UpdateProductoDto{

    @ApiProperty({ example: 'Cloro Clorinda 500 ml', description: 'Nombre del producto', required: false })
    @IsOptional()
    @IsString({ message: 'El nombre del producto debe ser una cadena de texto' })
    nombreProducto?: string;

    @ApiProperty({ example: 1500, description: 'Precio del producto', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'El precio del producto debe ser un número' })
    @Min(0, { message: 'El precio del producto no puede ser negativo' })
    precioProducto?: number;

    @ApiProperty({ example: 2000, description: 'Precio de venta del producto', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'El precio de venta del producto debe ser un número' })
    @Min(0, { message: 'El precio de venta del producto no puede ser negativo' })
    precioVentaProducto?: number;

    @ApiProperty({ example: 'Producto desinfectante para uso doméstico', description: 'Descripción del producto', required: false })
    @IsOptional()
    @IsString({ message: 'La descripción del producto debe ser una cadena de texto' })
    descripcionProducto?: string;

    @ApiProperty({ example: 'CLO-500ML-CLORINDA', description: 'SKU del producto', required: false })
    @IsOptional()
    @IsString({ message: 'El SKU del producto debe ser una cadena de texto' })
    sku?: string;

    @ApiProperty({ example: 1, description: 'ID de la categoría asociada al producto', required: false })
    @IsOptional()
    idCategoria?: Categoria;

    @ApiProperty({ example: true, description: 'Indica si el producto está activo o no', required: false })
    @IsOptional()
    productoActivo?: boolean;

    @ApiProperty({ example: 'http://example.com/imagen.jpg', description: 'URL de la imagen del producto', required: false })
    @IsOptional()
    @IsString({ message: 'La URL de la imagen del producto debe ser una cadena de texto' })
    urlImagenProducto?: string;

    @ApiProperty({ example: 1, description: 'ID de la imagen almacenada en Cloudinary', required: false })
    @IsOptional()
    @IsString({ message: 'El ID de la imagen debe ser una cadena de texto' })
    publicId?: string

    @ApiProperty({ example: 1, description: 'ID de la marca asociada al producto', required: false })
    @IsOptional()
    idMarca?: Marca;

    @ApiProperty({ example: 100, description: 'Stock del producto', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'El stock debe ser un número' })
    @Min(0, { message: 'El stock no puede ser negativo' })
    stock?: number;

    @ApiProperty({ example: 1, description: 'ID de la bodega donde se almacena el producto', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'El ID de la bodega debe ser un número' })
    idBodega?: number;
}