import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleBoleta } from './entities/detalle_boleta.entity';
import { CreateDetalleBoletaDto, UpdateDetalleBoletaDto } from './dto/detalle_boleta.dto';

@Injectable()
export class DetalleBoletasService {
  constructor(
    @InjectRepository(DetalleBoleta)
    private readonly detalleRepo: Repository<DetalleBoleta>,
  ) {}

  findAll() {
    return this.detalleRepo.find({ relations: ['idBoleta', 'idProducto'] });
  }

  async findOne(id: number) {
    const detalle = await this.detalleRepo.findOne({
      where: { idDetalle: id },
      relations: ['idBoleta', 'idProducto'],
    });
    if (!detalle) throw new NotFoundException('Detalle no encontrado');
    return detalle;
  }

  create(dto: CreateDetalleBoletaDto) {
    const detalle = this.detalleRepo.create(dto);
    return this.detalleRepo.save(detalle);
  }

  async update(id: number, dto: UpdateDetalleBoletaDto) {
    await this.detalleRepo.update({ idDetalle: id }, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const detalle = await this.findOne(id);
    await this.detalleRepo.remove(detalle);
    return { message: 'Detalle eliminado' };
  }
}
