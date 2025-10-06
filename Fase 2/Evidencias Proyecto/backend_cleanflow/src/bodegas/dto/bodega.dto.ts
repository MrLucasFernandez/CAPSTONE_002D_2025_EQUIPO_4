export class CreateBodegasDto {
    idBodega: number;
    nombre: string;
    direccion: string;
}
export class UpdateBodegasDto {
    idBodega: number;
    nombre?: string;
    direccion?: string;
}
