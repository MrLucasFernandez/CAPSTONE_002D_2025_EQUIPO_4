import { Boleta } from '../../boletas/entities/boleta.entity';
import { Producto } from '../../productos/entities/producto.entity';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDetalleBoletaDto {

    @ApiProperty({ example: 1, description: 'ID de la boleta asociada al detalle' })
    @IsNumber({}, { message: 'El ID de la boleta debe ser un número' })
    idBoleta: Boleta;

    @ApiProperty({ example: 1, description: 'ID del producto asociado al detalle' })
    @IsNumber({}, { message: 'El ID del producto debe ser un número' })
    idProducto: Producto;

    @ApiProperty({ example: 2, description: 'Cantidad del producto en el detalle' })
    @IsNumber({}, { message: 'La cantidad debe ser un número' })
    cantidad: number;

    @ApiProperty({ example: 500, description: 'Precio unitario del producto en el detalle' })
    @IsNumber({}, { message: 'El precio unitario debe ser un número' })
    @Min(0, { message: 'El precio unitario no puede ser negativo' })
    precioUnitario: number;

}

export class UpdateDetalleBoletaDto {

    @ApiProperty({ example: 1, description: 'ID de la boleta asociada al detalle', required: false })
    @IsNumber({}, { message: 'El ID de la boleta debe ser un número' })
    @IsOptional()
    idBoleta?: Boleta;

    @ApiProperty({ example: 1, description: 'ID del producto asociado al detalle', required: false })
    @IsNumber({}, { message: 'El ID del producto debe ser un número' })
    @IsOptional()
    idProducto?: Producto;

    @ApiProperty({ example: 2, description: 'Cantidad del producto en el detalle', required: false })
    @IsNumber({}, { message: 'La cantidad debe ser un número' })
    @IsOptional()
    cantidad?: number;

    @ApiProperty({ example: 500, description: 'Precio unitario del producto en el detalle', required: false })
    @IsNumber({}, { message: 'El precio unitario debe ser un número' })
    @IsOptional()
    @Min(0, { message: 'El precio unitario no puede ser negativo' })
    precioUnitario?: number;

}
