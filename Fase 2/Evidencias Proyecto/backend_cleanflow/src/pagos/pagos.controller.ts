import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto, UpdatePagoDto } from './dto/pago.dto';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Pagos')
@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Get()
  getAll() {
    return this.pagosService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.pagosService.findOne(id);
  }

  @Post()
  @ApiBody({
    schema: {
      example: {
        idBoleta: 1,
        fecha: '2024-10-01T10:00:00Z',
        monto: 5000,
        estado: 'PENDIENTE',
        metodoPago: 'Tarjeta de Crédito',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Pago creado correctamente' })
  create(@Body() dto: CreatePagoDto) {
    return this.pagosService.create(dto);
  }

  @Put(':id')
  @ApiBody({
    schema: {
      example: {
        idBoleta: 1,
        fecha: '2024-10-02T10:00:00Z',
        monto: 5500,
        estado: 'COMPLETADO',
        metodoPago: 'Transferencia Bancaria',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Pago actualizado correctamente' })
  update(@Param('id') id: number, @Body() dto: UpdatePagoDto) {
    return this.pagosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.pagosService.remove(id);
  }
}
