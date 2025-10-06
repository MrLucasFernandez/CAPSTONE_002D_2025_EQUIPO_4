import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { BoletasService } from './boletas.service';
import { CreateBoletaDto, UpdateBoletaDto } from './dto/boleta.dto';

@Controller('boletas')
export class BoletasController {
  constructor(private readonly boletasService: BoletasService) {}

  @Get()
  getAll() {
    return this.boletasService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.boletasService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateBoletaDto) {
    return this.boletasService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateBoletaDto) {
    return this.boletasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.boletasService.remove(id);
  }
}
