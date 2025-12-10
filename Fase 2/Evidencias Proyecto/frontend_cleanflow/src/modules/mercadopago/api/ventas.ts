import { apiRequest } from '@api/apiClient';

export interface ProductoVenta {
  idProducto: number;
  cantidad: number;
}

export interface GenerarVentaDto {
  idUsuario: number;
  idBodega: number;
  metodoPago: string;
  productos: ProductoVenta[];
}

export async function generarVenta(dto: GenerarVentaDto): Promise<any> {
  return apiRequest<any>('/ventas', {
    method: 'POST',
    body: dto,
  });
}
