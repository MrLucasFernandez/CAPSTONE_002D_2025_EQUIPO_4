import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto/usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  findAll() {
    return this.usuarioRepo.find();
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepo.findOne({
      where: { idUsuario: id },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  async create(dto: CreateUsuarioDto) {
    const usuario = this.usuarioRepo.create(dto);
    const hashPassword = await bcrypt.hash(dto.contrasena, 10);
    usuario.contrasena = hashPassword;
    return this.usuarioRepo.save(usuario);
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    if (dto.contrasena) {
      const hashPassword = await bcrypt.hash(dto.contrasena, 10);
      dto.contrasena = hashPassword;
    }
    await this.usuarioRepo.update({ idUsuario: id }, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const usuario = await this.findOne(id);
    await this.usuarioRepo.remove(usuario);
    return { message: 'Usuario eliminado' };
  }
}
