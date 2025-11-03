import { Usuario } from '../../usuarios/entities/usuario.entity';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBoletaDto {

    @ApiProperty({ example: 1, description: 'ID del usuario asociado a la boleta' })
    @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
    idUsuario: Usuario;
    
    @ApiProperty({ example: 'PENDIENTE', description: 'Estado de la boleta' })
    @IsString({ message: 'El estado de la boleta debe ser una cadena de texto' })
    estadoBoleta: string;

    @ApiProperty({ example: 1000, description: 'Subtotal de la boleta' })
    @IsNumber({}, { message: 'El subtotal de la boleta debe ser un número' })
    @Min(0, { message: 'El subtotal de la boleta no puede ser negativo' })
    subtotalBoleta: number;

    @ApiProperty({ example: 190, description: 'Impuesto aplicado a la boleta' })
    @IsNumber({}, { message: 'El impuesto debe ser un número' })
    @Min(0, { message: 'El impuesto no puede ser negativo' })
    impuesto: number;

    @ApiProperty({ example: 1190, description: 'Total de la boleta' })
    @IsNumber({}, { message: 'El total de la boleta debe ser un número' })
    @Min(0, { message: 'El total de la boleta no puede ser negativo' })
    totalBoleta: number;

}

export class UpdateBoletaDto {

    @ApiProperty({ example: 1, description: 'ID del usuario asociado a la boleta', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
    idUsuario?: Usuario;

    @ApiProperty({ example: 'PENDIENTE', description: 'Estado de la boleta', required: false })
    @IsOptional()
    @IsString({ message: 'El estado de la boleta debe ser una cadena de texto' })
    estadoBoleta?: string;

    @ApiProperty({ example: 1000, description: 'Subtotal de la boleta', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'El subtotal de la boleta debe ser un número' })
    @Min(0, { message: 'El subtotal de la boleta no puede ser negativo' })
    subtotalBoleta?: number;

    @ApiProperty({ example: 190, description: 'Impuesto aplicado a la boleta', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'El impuesto debe ser un número' })
    @Min(0, { message: 'El impuesto no puede ser negativo' })
    impuesto?: number;

    @ApiProperty({ example: 1190, description: 'Total de la boleta', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'El total de la boleta debe ser un número' })
    @Min(0, { message: 'El total de la boleta no puede ser negativo' })
    totalBoleta?: number;
}
