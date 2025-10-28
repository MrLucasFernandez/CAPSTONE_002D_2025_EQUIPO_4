import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { DetalleBoletasService } from './detalle_boletas.service';
import { CreateDetalleBoletaDto, UpdateDetalleBoletaDto } from './dto/detalle_boleta.dto';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiTags('Detalle Boletas')
@Controller('detalle')
export class DetalleBoletasController {
  constructor(private readonly detalleService: DetalleBoletasService) {}

  @Get()
  getAll() {
    return this.detalleService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.detalleService.findOne(id);
  }

  @Post()
  @ApiBody({
    schema: {
      example: {
        idBoleta: 1, 
        idProducto: 2, 
        cantidad: 3, 
        precioUnitario: 1500,
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Detalle de boleta creado correctamente' })
  create(@Body() dto: CreateDetalleBoletaDto) {
    return this.detalleService.create(dto);
  }

  @Put(':id')
  @ApiBody({
    schema: {
      example: {
        idBoleta: 1, 
        idProducto: 2, 
        cantidad: 5,
        precioUnitario: 1600,
      }, 
    },
  })
  @ApiResponse({ status: 200, description: 'Detalle de boleta actualizado correctamente' })
  update(@Param('id') id: number, @Body() dto: UpdateDetalleBoletaDto) {
    return this.detalleService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.detalleService.remove(id);
  }
}

