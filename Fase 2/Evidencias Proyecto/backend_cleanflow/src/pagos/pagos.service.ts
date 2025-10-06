import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { CreatePagoDto, UpdatePagoDto } from './dto/pago.dto';

@Injectable()
export class PagosService {

  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepo: Repository<Pago>,
  ) {}

  findAll() {
    return this.pagoRepo.find();
  }
  async findOne(id: number) {
    const pago = await this.pagoRepo.findOne({ where: { idPago: id } });
    if (!pago) throw new NotFoundException('Pago no encontrado');
    return pago;
  }

  create(dto: CreatePagoDto) {
    const pago = this.pagoRepo.create(dto);
    return this.pagoRepo.save(pago);
  }

  async update(id: number, dto: UpdatePagoDto) {
    await this.pagoRepo.update({ idPago: id }, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const pago = await this.findOne(id);
    await this.pagoRepo.remove(pago);
    return { message: 'Pago eliminado' };
  }
}
