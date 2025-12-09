import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto/categoria.dto';
import { Producto } from 'src/productos/entities/producto.entity';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepo: Repository<Categoria>,
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
  ) {}

  findAllClientes() {
    return this.categoriaRepo.find({ where: { categoriaActiva: true } });
  }

  findAllAdmin() {
    return this.categoriaRepo.find();
  }

  async findOne(id: number) {
    const categoria = await this.categoriaRepo.findOne({ where: { idCategoria: id } });
    if (!categoria) throw new NotFoundException('Categoría no encontrada');
    return categoria;
  }

  create(dto: CreateCategoriaDto) {
    const categoria = this.categoriaRepo.create(dto);
    return this.categoriaRepo.save(categoria);
  }

  async update(id: number, dto: UpdateCategoriaDto) {
    await this.categoriaRepo.update({ idCategoria: id }, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.categoriaRepo.update({ idCategoria: id }, { categoriaActiva: false });
    await this.productoRepo.update({ idCategoria: id }, { productoActivo: false });
    return { message: 'Categoría desactivada' };
  }
}

