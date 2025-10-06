import { Injectable } from '@nestjs/common';
import { CreateBodegasDto, UpdateBodegasDto } from './dto/bodega.dto';
import { Repository } from 'typeorm';
import { Bodega } from './entities/bodega.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class BodegasService {

  constructor(
    @InjectRepository(Bodega)
    private readonly bodegasRepo: Repository<Bodega>,
  ) {}  

  create(createBodegasDto: CreateBodegasDto) {
    const bodega = this.bodegasRepo.create(createBodegasDto);
    return this.bodegasRepo.save(bodega);
  }

  findAll() {
    return this.bodegasRepo.find();
  }

  async findOne(id: number) {
    const bodega = await this.bodegasRepo.findOne({ where: { idBodega: id } });
    if (!bodega) throw new NotFoundException('Bodega no encontrada');
    return bodega;
  }

  async update(id: number, updateBodegasDto: UpdateBodegasDto) {
    await this.bodegasRepo.update({ idBodega: id }, updateBodegasDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const bodega = await this.findOne(id);
    await this.bodegasRepo.remove(bodega);
    return { message: 'Bodega eliminada' };
  }
}
