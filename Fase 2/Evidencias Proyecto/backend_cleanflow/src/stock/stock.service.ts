import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Bodega } from '../bodegas/entities/bodega.entity';
import { CreateStockDto, UpdateStockDto } from './dto/stock.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>,

    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,

    @InjectRepository(Bodega)
    private readonly bodegaRepo: Repository<Bodega>,
  ) {}
  
  async create(dto: CreateStockDto) {
    const producto = await this.productoRepo.findOne({ where: { idProducto: dto.idProducto } });
    if (!producto) throw new NotFoundException('El producto no existe');

    const bodega = await this.bodegaRepo.findOne({ where: { idBodega: dto.idBodega } });
    if (!bodega) throw new NotFoundException('La bodega no existe');

    const stockExistente = await this.stockRepo.findOne({
      where: { idProducto: dto.idProducto, idBodega: dto.idBodega },
    });
    if (stockExistente) throw new BadRequestException('Ya existe stock para ese producto en esa bodega');

    if (dto.cantidad < 0) {
      throw new BadRequestException('La cantidad no puede ser negativa');
    }


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
    const stock = await this.findOne(idProducto, idBodega);
    if (!stock) {
      throw new NotFoundException(`Stock para el producto ID: ${idProducto} en la bodega ID: ${idBodega} no encontrado`);
    }

    if (dto.cantidad !== undefined && dto.cantidad < 0) {
      throw new BadRequestException('La cantidad no puede ser negativa');
    }

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
