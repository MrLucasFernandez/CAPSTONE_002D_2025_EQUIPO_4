import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateRolDto, UpdateRolDto } from './dto/rol.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,
  ) {}

  findAll() {
    return this.rolRepo.find();
  }

  async findOne(id: number) {
    const rol = await this.rolRepo.findOne({ where: { idRol: id } });
    if (!rol) throw new NotFoundException('Rol no encontrado');
    return rol;
  }

  create (dto: CreateRolDto) {
    const rol = this.rolRepo.create(dto);
    return this.rolRepo.save(rol);
  }

  async update(id: number, updateRolDto: UpdateRolDto) {
    await this.rolRepo.update({ idRol: id }, updateRolDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const rol = await this.findOne(id);
    await this.rolRepo.remove(rol);
    return { message: 'Rol eliminado' };
  }
}
