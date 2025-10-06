import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { DetalleBoletasService } from './detalle_boletas.service';
import { CreateDetalleBoletaDto, UpdateDetalleBoletaDto } from './dto/detalle_boleta.dto';

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
  create(@Body() dto: CreateDetalleBoletaDto) {
    return this.detalleService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateDetalleBoletaDto) {
    return this.detalleService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.detalleService.remove(id);
  }
}

