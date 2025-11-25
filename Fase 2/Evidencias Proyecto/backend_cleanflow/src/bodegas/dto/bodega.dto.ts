import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBodegasDto {

    @ApiProperty({ example: 'Bodega Central', description: 'Nombre de la bodega' })
    @IsNotEmpty()
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    nombre: string;

    @ApiProperty({ example: 'Calle Falsa 123', description: 'Dirección de la bodega' })
    @IsNotEmpty()
    @IsString({ message: 'La dirección debe ser una cadena de texto' })
    direccion: string;
}


export class UpdateBodegasDto {

    @ApiProperty({ example: 'Bodega Central', description: 'Nombre de la bodega', required: false })
    @IsOptional()
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    nombre?: string;

    @ApiProperty({ example: 'Calle Falsa 123', description: 'Dirección de la bodega', required: false })
    @IsOptional()
    @IsString({ message: 'La dirección debe ser una cadena de texto' })
    direccion?: string;
}
