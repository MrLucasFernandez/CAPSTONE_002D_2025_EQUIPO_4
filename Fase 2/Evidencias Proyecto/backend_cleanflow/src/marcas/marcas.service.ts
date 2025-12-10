import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMarcaDto, UpdateMarcaDto } from './dto/marca.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marca } from './entities/marca.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { PushService } from 'src/push_token/push_token.service';

@Injectable()
export class MarcasService {
  constructor(
    @InjectRepository(Marca)
    private readonly marcaRepo: Repository<Marca>,
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,
    private readonly pushService: PushService,
  ){}

  create(createMarcaDto: CreateMarcaDto) {
    const marca = this.marcaRepo.create(createMarcaDto);
    return this.marcaRepo.save(marca);
  }

  findAllClientes() {
    return this.marcaRepo.find({ where: { marcaActiva: true } });
  }

  findAllAdmin() {
    return this.marcaRepo.find();
  }

  findOne(id: number) {
    const marca = this.marcaRepo.findOne({ where: { idMarca: id } });
    if (!marca) throw new NotFoundException('Marca no encontrada');
    return marca;
  }

  async update(id: number, updateMarcaDto: UpdateMarcaDto) {
    await this.marcaRepo.update({ idMarca: id }, updateMarcaDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.marcaRepo.update({ idMarca: id }, { marcaActiva: false });
    await this.productoRepo.update({ idMarca: id }, { productoActivo: false });

    await this.pushService.sendToRole('Administrador', 'Marca Desactivada', `La marca con ID ${id} ha sido desactivada, junto con sus productos asociados.`);
    await this.pushService.sendToRole('Empleado', 'Marca Desactivada', `La marca con ID ${id} ha sido desactivada, junto con sus productos asociados.`);
    return { message: 'Marca desactivada' };
  }
}
