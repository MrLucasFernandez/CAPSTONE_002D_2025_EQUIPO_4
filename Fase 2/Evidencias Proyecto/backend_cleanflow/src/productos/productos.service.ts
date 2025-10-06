import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto, UpdateProductoDto } from './dto/producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
  ) {}

  findAll() {
    return this.productoRepo.find({ where: { productoActivo: true } });
  }

  async findOne(id: number) {
    const producto = await this.productoRepo.findOne({ where: { idProducto: id } });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  create(dto: CreateProductoDto) {
    const producto = this.productoRepo.create(dto);
    return this.productoRepo.save(producto);
  }

  async update(id: number, dto: UpdateProductoDto) {
    await this.productoRepo.update({ idProducto: id }, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.productoRepo.update({ idProducto: id }, { productoActivo: false });
    return { message: 'Producto desactivado' };
  }
}