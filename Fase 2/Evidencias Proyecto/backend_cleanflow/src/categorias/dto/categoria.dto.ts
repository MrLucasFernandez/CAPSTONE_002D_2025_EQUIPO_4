import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoriaDto {

    @ApiProperty({ example: 'Aseo Baños', description: 'Nombre de la categoría' })
    @IsString({ message: 'El nombre de la categoría debe ser una cadena de texto' })
    nombreCategoria: string;

    @ApiProperty({ example: 'Productos de aseo para baños', description: 'Descripción de la categoría' })
    @IsString({ message: 'La descripción de la categoría debe ser una cadena de texto' })
    descripcionCategoria?: string;
}

export class UpdateCategoriaDto {

    @ApiProperty({ example: 'Aseo Baños', description: 'Nombre de la categoría', required: false })
    @IsOptional()
    @IsString({ message: 'El nombre de la categoría debe ser una cadena de texto' })
    nombreCategoria?: string;

    @ApiProperty({ example: 'Productos de aseo para baños', description: 'Descripción de la categoría', required: false })
    @IsOptional()
    @IsString({ message: 'La descripción de la categoría debe ser una cadena de texto' })
    descripcionCategoria?: string;

    @ApiProperty({ example: true, description: 'Indica si la categoría está activa o no', required: false })
    @IsOptional()
    @IsBoolean({ message: 'El estado de la categoría debe ser un valor booleano' })
    categoriaActiva?: boolean;
}