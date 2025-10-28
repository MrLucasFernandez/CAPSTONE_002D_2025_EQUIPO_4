import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boleta } from './entities/boleta.entity';
import { CreateBoletaDto, UpdateBoletaDto } from './dto/boleta.dto';

@Injectable()
export class BoletasService {
  constructor(
    @InjectRepository(Boleta)
    private readonly boletaRepo: Repository<Boleta>,
  ) {}

  findAll() {
    return this.boletaRepo.find({ relations: ['detalles'] });
  }

  async findOne(id: number) {
    const boleta = await this.boletaRepo.findOne({
      where: { idBoleta: id },
      relations: ['idUsuario', 'detalles', 'pagos'],
    });
    if (!boleta) throw new NotFoundException('Boleta no encontrada');
    return boleta;
  }

  create(dto: CreateBoletaDto) {
    const boleta = this.boletaRepo.create(dto);
    return this.boletaRepo.save(boleta);
  }

  async update(id: number, dto: UpdateBoletaDto) {
    await this.boletaRepo.update({ idBoleta: id }, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const boleta = await this.findOne(id);
    await this.boletaRepo.remove(boleta);
    return { message: 'Boleta eliminada' };
  }
}

