import { Boleta } from '../../boletas/entities/boleta.entity';
import { IsDate, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePagoDto {

    @ApiProperty({ example: 1, description: 'ID de la boleta asociada al pago' })
    @IsNumber({}, { message: 'El ID de la boleta debe ser un número' })
    idBoleta: Boleta;

    @ApiProperty({ example: '2024-06-15T12:00:00Z', description: 'Fecha del pago' })
    @IsDate({ message: 'La fecha del pago debe ser una fecha válida' })
    fecha: Date;

    @ApiProperty({ example: 1500, description: 'Monto del pago' })
    @IsNumber({}, { message: 'El monto del pago debe ser un número' })
    @Min(0, { message: 'El monto del pago no puede ser negativo' })
    monto: number;

    @ApiProperty({ example: 'COMPLETADO', description: 'Estado del pago' })
    @IsString({ message: 'El estado del pago debe ser una cadena de texto' })
    estado: string;

    @ApiProperty({ example: 'Tarjeta de crédito', description: 'Método de pago utilizado' })
    @IsString({ message: 'El método de pago debe ser una cadena de texto' })
    metodoPago: string;
}

export class UpdatePagoDto {

    @ApiProperty({ example: 1, description: 'ID de la boleta asociada al pago', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'El ID de la boleta debe ser un número' })
    idBoleta?: Boleta;

    @ApiProperty({ example: '2024-06-15T12:00:00Z', description: 'Fecha del pago', required: false })
    @IsOptional()
    @IsDate({ message: 'La fecha del pago debe ser una fecha válida' })
    fecha?: Date;

    @ApiProperty({ example: 1500, description: 'Monto del pago', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'El monto del pago debe ser un número' })
    @Min(0, { message: 'El monto del pago no puede ser negativo' })
    monto?: number;

    @ApiProperty({ example: 'COMPLETADO', description: 'Estado del pago', required: false })
    @IsOptional()
    @IsString({ message: 'El estado del pago debe ser una cadena de texto' })
    estado?: string;
    
    @ApiProperty({ example: 'Tarjeta de crédito', description: 'Método de pago utilizado', required: false })
    @IsOptional()
    @IsString({ message: 'El método de pago debe ser una cadena de texto' })
    metodoPago?: string;
}