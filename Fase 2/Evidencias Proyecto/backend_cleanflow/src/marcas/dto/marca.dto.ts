import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMarcaDto {

    @ApiProperty({ example: 'Huggies', description: 'Nombre de la marca' })
    @IsString({ message: 'El nombre de la marca debe ser una cadena de texto' })
    nombreMarca: string;

    @ApiProperty({ example: 'Marca de pañales y productos para bebés', description: 'Descripción de la marca' })
    @IsString({ message: 'La descripción de la marca debe ser una cadena de texto' })
    descripcionMarca?: string;
}

export class UpdateMarcaDto{

    @ApiProperty({ example: 'Huggies', description: 'Nombre de la marca', required: false })
    @IsOptional()
    @IsString({ message: 'El nombre de la marca debe ser una cadena de texto' })
    nombreMarca?: string;

    @ApiProperty({ example: 'Marca de pañales y productos para bebés', description: 'Descripción de la marca', required: false })
    @IsOptional()
    @IsString({ message: 'La descripción de la marca debe ser una cadena de texto' })
    descripcionMarca?: string;

    @ApiProperty({ example: true, description: 'Indica si la marca está activa o no', required: false })
    @IsOptional()
    @IsBoolean({ message: 'El estado de la marca debe ser un valor booleano' })
    marcaActiva?: boolean;
}
