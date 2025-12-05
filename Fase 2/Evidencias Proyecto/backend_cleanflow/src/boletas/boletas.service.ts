import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Boleta } from './entities/boleta.entity';
import { CreateBoletaDto, UpdateBoletaDto } from './dto/boleta.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Pago } from '../pagos/entities/pago.entity';

@Injectable()
export class BoletasService {
  private readonly logger = new Logger(BoletasService.name);

  constructor(
    @InjectRepository(Boleta)
    private readonly boletaRepo: Repository<Boleta>,
    @InjectRepository(Pago)
    private readonly pagoRepo: Repository<Pago>,
  ) {}

  findAll() {
    return this.boletaRepo.find();
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

  async anular(id: number) {
    await this.boletaRepo.update({ idBoleta: id }, { estadoBoleta: 'ANULADA' });
    await this.pagoRepo.update({ idBoleta: id }, { estado: 'RECHAZADO' });
    return { message: 'Boleta anulada' };
  }

  // Cancela automáticamente las boletas pendientes que hayan expirado
  @Cron(CronExpression.EVERY_MINUTE)
  async cancelarBoletasExpiradas() {
    const tiempoExpiracion = new Date();
    tiempoExpiracion.setMinutes(tiempoExpiracion.getMinutes() - 3);

    const boletasExpiradas = await this.boletaRepo.find({
      where: {
        estadoBoleta: 'PENDIENTE',
        fecha: LessThan(tiempoExpiracion),
      },
    });

    if (boletasExpiradas.length > 0) {
      this.logger.log(`Encontradas ${boletasExpiradas.length} boletas expiradas. Cancelando...`);
      for (const boleta of boletasExpiradas) {
        boleta.estadoBoleta = 'RECHAZADA';
        await this.boletaRepo.save(boleta);
      }
      this.logger.log('Boletas expiradas canceladas correctamente.');
    }
  }
}

