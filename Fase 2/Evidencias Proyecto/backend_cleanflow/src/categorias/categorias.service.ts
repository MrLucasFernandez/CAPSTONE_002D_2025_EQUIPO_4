import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto/categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepo: Repository<Categoria>,
  ) {}

  findAll() {
    return this.categoriaRepo.find({ where: { categoriaActiva: true } });
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
    return { message: 'Categoría desactivada' };
  }
}

