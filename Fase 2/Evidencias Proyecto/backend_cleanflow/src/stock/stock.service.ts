import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { CreateStockDto, UpdateStockDto } from './dto/stock.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>,
  ) {}
  
  async create(dto: CreateStockDto) {
    const stock = this.stockRepo.create(dto);
    return this.stockRepo.save(stock);
  }

  findAll() {
    return this.stockRepo.find();
  }

  async findOne(idProducto: number, idBodega: number) {
    const stock = await this.stockRepo.findOne({ where: { idProducto, idBodega } });

    if (!stock) {
      throw new NotFoundException(
        `No se encontró stock para producto ${idProducto} en bodega ${idBodega}`,
      );
    }
    return stock;
  }

  findByProducto(idProducto: number) {
    return this.stockRepo.find({
      where: { idProducto },
      relations: ['producto'],
    });
  }

  findByBodega(idBodega: number) {
    return this.stockRepo.find({
      where: { idBodega },
      relations: [ 'bodega'],
    });
  }

  async update(idProducto: number, idBodega: number, dto: UpdateStockDto) {
    await this.stockRepo.update({ idProducto, idBodega }, dto);
    return this.findOne(idProducto, idBodega);
  }

  async remove(idProducto: number, idBodega: number) {
    const stock = await this.findOne(idProducto, idBodega);
    if (!stock) {
      throw new NotFoundException(`Stock para el producto ID: ${idProducto} en la bodega ID: ${idBodega} no encontrado`);
    }
    return this.stockRepo.remove(stock);
  }
}
