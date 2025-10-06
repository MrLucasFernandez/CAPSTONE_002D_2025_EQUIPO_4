import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolUsuario } from './entities/rol_usuario.entity';
import { CreateRolUsuarioDto, DeleteRolUsuarioDto } from './dto/rol_usuario.dto';

@Injectable()
export class RolUsuariosService {
  constructor(
    @InjectRepository(RolUsuario)
    private readonly rolUsuarioRepo: Repository<RolUsuario>,
  ) {}

  findAll() {
    return this.rolUsuarioRepo.find({ relations: ['usuario', 'rol'] });
  }

  async findByUsuario(idUsuario: number) {
    const relaciones = await this.rolUsuarioRepo.find({
      where: { idUsuario },
      relations: ['rol'],
    });
    if (!relaciones.length) {
      throw new NotFoundException('Este usuario no tiene roles asignados');
    }
    return relaciones;
  }

  async findByRol(idRol: number) {
    const relaciones = await this.rolUsuarioRepo.find({
      where: { idRol },
      relations: ['usuario'],
    });
    if (!relaciones.length) {
      throw new NotFoundException('Este rol no tiene usuarios asignados');
    }
    return relaciones;
  }

  create(dto: CreateRolUsuarioDto) {
    const asignacion = this.rolUsuarioRepo.create(dto);
    return this.rolUsuarioRepo.save(asignacion);
  }

  async remove(dto: DeleteRolUsuarioDto) {
    await this.rolUsuarioRepo.delete(dto);
    return { message: 'Rol quitado del usuario' };
  }
}

