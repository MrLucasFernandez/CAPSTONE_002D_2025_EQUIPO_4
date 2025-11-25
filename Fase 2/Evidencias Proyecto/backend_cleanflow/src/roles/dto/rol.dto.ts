import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRolDto {

    @ApiProperty({ example: 'Admin', description: 'Tipo de rol' })
    @IsString({ message: 'El tipo de rol debe ser una cadena de texto' })
    tipoRol: string;

    @ApiProperty({ example: 'Rol con permisos administrativos', description: 'Descripción del rol' })
    @IsString({ message: 'La descripción del rol debe ser una cadena de texto' })
    descripcionRol: string;
}

export class UpdateRolDto {

    @ApiProperty({ example: 'Admin', description: 'Tipo de rol', required: false })
    @IsString({ message: 'El tipo de rol debe ser una cadena de texto' })
    tipoRol?: string;

    @ApiProperty({ example: 'Rol con permisos administrativos', description: 'Descripción del rol', required: false })
    @IsString({ message: 'La descripción del rol debe ser una cadena de texto' })
    descripcionRol?: string;
}