import { IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateStockDto {
    @ApiProperty({ example: 1, description: 'ID del producto' })
    @IsNumber({},{ message: 'El idProducto debe ser un número entero' })
    idProducto: number;

    @ApiProperty({ example: 1, description: 'ID de la bodega' })
    @IsNumber({},{ message: 'El idBodega debe ser un número entero' })
    idBodega: number;

    @ApiProperty({ example: 100, description: 'Cantidad de stock disponible' })
    @IsNumber({},{ message: 'La cantidad debe ser un número entero' })
    @Min(0, { message: 'La cantidad no puede ser negativa' })
    cantidad: number;
}

export class UpdateStockDto {
    @ApiProperty({ example: 150, description: 'Cantidad de stock disponible', required: false })
    @IsOptional()
    @IsNumber({},{ message: 'La cantidad debe ser un número entero' })
    @Min(0, { message: 'La cantidad no puede ser negativa' })
    cantidad?: number;
}
