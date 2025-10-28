import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { BoletasService } from './boletas.service';
import { CreateBoletaDto, UpdateBoletaDto } from './dto/boleta.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiTags('Boletas')
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
  @ApiBody({
    schema: {
      example: {
        idUsuario: 1,
        estadoBoleta: 'PENDIENTE',
        subtotalBoleta: 130000,
        impuesto: 20000,
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Boleta creada correctamente' })
  create(@Body() dto: CreateBoletaDto) {
    return this.boletasService.create(dto);
  }

  @Put(':id')
  @ApiBody({
    schema: {
      example: {
        idUsuario: 1,
        estadoBoleta: 'PAGADA',
        subtotalBoleta: 260000,
        impuesto: 40000,
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Boleta actualizada correctamente' })
  update(@Param('id') id: number, @Body() dto: UpdateBoletaDto) {
    return this.boletasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.boletasService.remove(id);
  }
}
