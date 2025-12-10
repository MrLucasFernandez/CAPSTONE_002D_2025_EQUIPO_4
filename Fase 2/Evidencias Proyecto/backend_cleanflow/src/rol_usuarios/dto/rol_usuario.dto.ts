import { IsNumber, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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

export class UpdateRolUsuarioDto {
    @ApiProperty({example: { idUsuario: 1, idRol: 1 }, description: 'Objeto con rol a eliminar' })
    @ValidateNested()
    @Type(() => DeleteRolUsuarioDto)
    dtoDelete: DeleteRolUsuarioDto;

    @ApiProperty({example: { idUsuario: 1, idRol: 2 }, description: 'Objeto con nuevo rol a asignar' })
    @ValidateNested()
    @Type(() => CreateRolUsuarioDto)
    dtoCreate: CreateRolUsuarioDto;
}
