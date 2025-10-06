export class CreateRolDto {
    tipoRol: string;
    descripcionRol: string;
}

export class UpdateRolDto {
    tipoRol?: string;
    descripcionRol?: string;
}