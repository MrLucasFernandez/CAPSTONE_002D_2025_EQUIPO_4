import { IsNotEmpty, IsOptional, IsString, IsNumber, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterTokenDto {

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Token de notificación push' })
    @IsNotEmpty({ message: 'El token no puede estar vacío' })
    @IsString({ message: 'El token debe ser una cadena de texto' })
    token: string;
    
    @ApiProperty({ example: 'ios', description: 'Plataforma del dispositivo' })
    @IsOptional()
    @IsString({ message: 'La plataforma debe ser una cadena de texto' })
    platform?: string;
}

export class SendNotificationDto {
    @ApiProperty({ example: 1, description: 'ID del usuario destinatario' })
    @IsNotEmpty({ message: 'El userId es requerido' })
    @IsNumber({}, { message: 'El userId debe ser un número' })
    userId: number;

    @ApiProperty({ example: 'Nuevo pedido', description: 'Título de la notificación' })
    @IsNotEmpty({ message: 'El título es requerido' })
    @IsString({ message: 'El título debe ser texto' })
    title: string;

    @ApiProperty({ example: 'Tienes un nuevo pedido pendiente', description: 'Cuerpo de la notificación' })
    @IsNotEmpty({ message: 'El cuerpo es requerido' })
    @IsString({ message: 'El cuerpo debe ser texto' })
    body: string;

    @ApiProperty({ example: { orderId: '123', type: 'order' }, description: 'Datos adicionales', required: false })
    @IsOptional()
    @IsObject({ message: 'Los datos deben ser un objeto' })
    data?: Record<string, string>;
}