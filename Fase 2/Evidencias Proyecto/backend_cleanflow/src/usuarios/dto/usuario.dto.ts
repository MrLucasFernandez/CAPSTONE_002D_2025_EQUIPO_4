import { IsEmail, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {

    @ApiProperty({ example: 'Juan', description: 'Nombre del usuario' })
    @IsString({ message: 'El nombre del usuario debe ser una cadena de texto' })
    nombreUsuario: string;

    @ApiProperty({ example: 'Pérez', description: 'Apellido del usuario' })
    @IsString({ message: 'El apellido del usuario debe ser una cadena de texto' })
    apellidoUsuario: string;

    @ApiProperty({ example: 912345678, description: 'Teléfono del usuario', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'El teléfono del usuario debe ser un número' })
    telefono?: number;

    @ApiProperty({ example: '12345678-9', description: 'RUT del usuario' })
    @IsString({ message: 'El RUT del usuario debe ser una cadena de texto' })
    rut: string;

    @ApiProperty({ example: 'Calle Falsa 123', description: 'Dirección del usuario', required: false })
    @IsOptional()
    @IsString({ message: 'La dirección del usuario debe ser una cadena de texto' })
    direccionUsuario?: string;

    @ApiProperty({ example: 'correo.ejemplo@gmail.com', description: 'Correo electrónico del usuario' })
    @IsEmail({}, { message: 'El correo electrónico debe tener un formato válido' })
    correo: string;

    @ApiProperty({ example: 'contrasenaSegura123', description: 'Contraseña del usuario' })
    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    contrasena: string;
}

export class UpdateUsuarioDto {

    @ApiProperty({ example: 'Juan', description: 'Nombre del usuario', required: false })
    @IsOptional()
    @IsString({ message: 'El nombre del usuario debe ser una cadena de texto' })
    nombreUsuario?: string;

    @ApiProperty({ example: 'Pérez', description: 'Apellido del usuario', required: false })
    @IsOptional()
    @IsString({ message: 'El apellido del usuario debe ser una cadena de texto' })
    apellidoUsuario?: string

    @ApiProperty({ example: 912345678, description: 'Teléfono del usuario', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'El teléfono del usuario debe ser un número' })
    telefono?: number;

    @ApiProperty({ example: 'Calle Falsa 123', description: 'Dirección del usuario', required: false })
    @IsOptional()
    @IsString({ message: 'La dirección del usuario debe ser una cadena de texto' })
    direccionUsuario?: string;

    @ApiProperty({ example: 'correo.ejemplo@gmail.com', description: 'Correo electrónico del usuario' })
    @IsOptional()
    @IsEmail({}, { message: 'El correo electrónico debe tener un formato válido' })
    correo?: string;

    @ApiProperty({ example: 'contrasenaSegura123', description: 'Contraseña del usuario', required: false })
    @IsOptional()
    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    contrasena?: string;
}
