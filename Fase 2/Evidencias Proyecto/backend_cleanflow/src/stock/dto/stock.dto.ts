
export class CreateStockDto {
    idProducto: number;
    idBodega: number;
    cantidad: number;
}

export class UpdateStockDto {
    cantidad?: number;
}
