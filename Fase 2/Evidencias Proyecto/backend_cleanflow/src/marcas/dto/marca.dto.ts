export class CreateMarcaDto {
    nombreMarca: string;
    descripcionMarca?: string;
}

export class UpdateMarcaDto{
    nombreMarca?: string;
    descripcionMarca?: string;
    marcaActiva?: boolean;
}
