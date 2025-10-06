import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto, UpdateClienteDto } from './dto/cliente.dto';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  getAll() {
    return this.clientesService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.clientesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateClienteDto) {
    return this.clientesService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateClienteDto) {
    return this.clientesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.clientesService.remove(id);
  }
}
