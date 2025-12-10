import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Pago } from './entities/pago.entity';
import { CreatePagoDto, UpdatePagoDto } from './dto/pago.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PagosService {
  private readonly logger = new Logger(PagosService.name);

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

  @Cron(CronExpression.EVERY_MINUTE)
  async cancelarPagosExpirados() {
    const tiempoExpiracion = new Date();
    tiempoExpiracion.setMinutes(tiempoExpiracion.getMinutes() - 3);

    const pagosExpirados = await this.pagoRepo.find({
      where: {
        estado: 'PENDIENTE',
        fecha: LessThan(tiempoExpiracion),
      },
    });

    if (pagosExpirados.length > 0) {
      for (const pago of pagosExpirados) {
        pago.estado = 'RECHAZADO';
        await this.pagoRepo.save(pago);
      }
      this.logger.log('Pagos expirados rechazados correctamente.');
    }
  }
}
