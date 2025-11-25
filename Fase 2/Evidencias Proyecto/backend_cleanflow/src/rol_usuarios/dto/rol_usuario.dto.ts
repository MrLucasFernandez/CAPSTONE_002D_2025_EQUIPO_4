import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRolUsuarioDto {

    @ApiProperty({ example: 1, description: 'ID del usuario' })
    @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
    idUsuario: number;

    @ApiProperty({ example: 1, description: 'ID del rol' })
    @IsNumber({}, { message: 'El ID del rol debe ser un número' })
    idRol: number;

}

export class DeleteRolUsuarioDto {

    @ApiProperty({ example: 1, description: 'ID del usuario' })
    @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
    idUsuario: number;

    @ApiProperty({ example: 1, description: 'ID del rol' })
    @IsNumber({}, { message: 'El ID del rol debe ser un número' })
    idRol: number;
}
