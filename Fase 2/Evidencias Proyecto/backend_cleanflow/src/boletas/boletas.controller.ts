import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { BoletasService } from './boletas.service';
import { CreateBoletaDto, UpdateBoletaDto } from './dto/boleta.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';

@ApiBearerAuth()
@ApiTags('Boletas')
@Controller('boletas')
export class BoletasController {
  constructor(private readonly boletasService: BoletasService) {}

  @Roles('Administrador','Empleado')
  @Get()
  getAll() {
    return this.boletasService.findAll();
  }

  @Roles('Administrador','Empleado')
  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.boletasService.findOne(id);
  }

  @Roles('Administrador','Empleado')
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

  @Roles('Administrador','Empleado')
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

  @Roles('Administrador')
  @Put('anular/:id')
  @ApiResponse({ status: 200, description: 'Boleta anulada correctamente' })
  anular(@Param('id') id: number) {
    return this.boletasService.anular(id);
  }
}
