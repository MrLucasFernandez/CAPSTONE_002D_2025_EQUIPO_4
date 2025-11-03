import { IsInt, IsNotEmpty, IsString, ValidateNested, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ProductoVentaDto {
    @ApiProperty({ example: 1, description: 'ID del producto' })
    @IsInt({ message: 'El idProducto debe ser un número entero' })
    idProducto: number;

    @ApiProperty({ example: 2, description: 'Cantidad del producto a vender' })
    @IsInt({ message: 'La cantidad debe ser un número entero' })
    cantidad: number;
}

export class CrearVentaDto {
    @ApiProperty({ example: 1, description: 'ID del cliente' })
    @IsInt({ message: 'El idCliente debe ser un número entero' })
    idUsuario: number;

    @ApiProperty({ example: 1, description: 'ID de la bodega' })
    @IsInt({ message: 'El idBodega debe ser un número entero' })
    idBodega: number;

    @ApiProperty({ example: 'tarjeta', description: 'Método de pago utilizado' })
    @IsString({ message: 'El metodoPago debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El metodoPago no debe estar vacío' })
    metodoPago: string;

    @ApiProperty({ type: [ProductoVentaDto], description: 'Lista de productos a vender' })
    @ValidateNested({ each: true })
    @Type(() => ProductoVentaDto)
    @IsArray({ message: 'La lista de productos debe ser un arreglo' })
    productos: ProductoVentaDto[];
}