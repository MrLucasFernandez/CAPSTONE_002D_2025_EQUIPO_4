import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto, UpdatePagoDto } from './dto/pago.dto';

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
  create(@Body() dto: CreatePagoDto) {
    return this.pagosService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdatePagoDto) {
    return this.pagosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.pagosService.remove(id);
  }
}
