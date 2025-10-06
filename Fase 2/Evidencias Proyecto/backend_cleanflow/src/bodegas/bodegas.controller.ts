import { Controller, Get, Post, Body,  Param, Delete, Put } from '@nestjs/common';
import { BodegasService } from './bodegas.service';
import { CreateBodegasDto, UpdateBodegasDto } from './dto/bodega.dto';

@Controller('bodegas')
export class BodegasController {
  constructor(private readonly bodegasService: BodegasService) {}

  @Post()
  create(@Body() createBodegasDto: CreateBodegasDto) {
    return this.bodegasService.create(createBodegasDto);
  }

  @Get()
  getAll() {
    return this.bodegasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bodegasService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBodegasDto: UpdateBodegasDto) {
    return this.bodegasService.update(+id, updateBodegasDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bodegasService.remove(+id);
  }
}
