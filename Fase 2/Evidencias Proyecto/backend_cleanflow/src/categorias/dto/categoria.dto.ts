export class CreateCategoriaDto {
    nombreCategoria: string;
    descripcionCategoria?: string;
}

export class UpdateCategoriaDto {
    nombreCategoria?: string;
    descripcionCategoria?: string;
    categoriaActiva?: boolean;
}