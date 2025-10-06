import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto, UpdateClienteDto } from './dto/cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,
  ) {}

  findAll() {
    return this.clienteRepo.find();
  }

  async findOne(id: number) {
    const cliente = await this.clienteRepo.findOne({ where: { idCliente: id } });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return cliente;
  }

  create(dto: CreateClienteDto) {
    const cliente = this.clienteRepo.create(dto);
    return this.clienteRepo.save(cliente);
  }

  async update(id: number, dto: UpdateClienteDto) {
    await this.clienteRepo.update({ idCliente: id }, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const cliente = await this.findOne(id);
    await this.clienteRepo.remove(cliente);
    return { message: 'Cliente eliminado' };
  }
}
