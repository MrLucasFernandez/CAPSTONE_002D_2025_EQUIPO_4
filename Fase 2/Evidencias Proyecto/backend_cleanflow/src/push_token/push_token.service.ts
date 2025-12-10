import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { PushToken } from './entities/push_token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FirebaseService } from '../firebase/firebase.service';
import { Usuario } from '../usuarios/entities/usuario.entity';


@Injectable()
export class PushService {
  constructor(
    @InjectRepository(PushToken)
    private repo: Repository<PushToken>,
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
    private firebase: FirebaseService
  ) {}

  async registerToken(userId: number | undefined, token: string, platform?: string) {
    
    let record = await this.repo.findOne({ where: { token } });
    if (!record) {
      record = this.repo.create({ userId, token, platform });
    } else {
      record.userId = userId ?? record.userId;
      record.platform = platform ?? record.platform;
    }
    return this.repo.save(record);
  }

  async unregisterToken(token: string) {
    return this.repo.delete({ token });
  }

  async sendToUser(userId: number, title: string, body: string, data?: Record<string, string>) {
    const tokens = await this.repo.find({ where: { userId } });
    const tokenList = tokens.map(t => t.token);
    if (!tokenList.length) return { sent: 0 };

    const res = await this.firebase.sendToTokens(tokenList, title, body, data);
    return res;
  }

  async sendToRole(rolNombre: string, title: string, body: string, data?: Record<string, string>) {
    const usuarios = await this.usuarioRepo
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.roles', 'rol')
      .where('rol.tipoRol = :rolNombre', { rolNombre })
      .getMany();

    if (!usuarios.length) return { sent: 0, skipped: 0 };

    let sentCount = 0;
    let skippedCount = 0;

    for (const usuario of usuarios) {
      const tokens = await this.repo.find({ where: { userId: usuario.idUsuario } });
      const tokenList = tokens.map(t => t.token);
      
      if (tokenList.length) {
        await this.firebase.sendToTokens(tokenList, title, body, data);
        sentCount += tokenList.length;
      } else {
        skippedCount++;
      }
    }

    return { sent: sentCount, skipped: skippedCount, usuarios: usuarios.length };
  }

  async sendToUsers(userIds: number[], title: string, body: string, data?: Record<string, string>) {
    const tokens = await this.repo.find({ 
      where: { userId: In(userIds) }
    });

    if (!tokens.length) return { sent: 0 };

    const tokenList = tokens.map(t => t.token);
    return this.firebase.sendToTokens(tokenList, title, body, data);
  }

  async sendBroadcast(title: string, body: string, data?: Record<string, string>) {
    const tokens = await this.repo.find();
    if (!tokens.length) return { sent: 0 };

    const tokenList = tokens.map(t => t.token);
    return this.firebase.sendToTokens(tokenList, title, body, data);
  }
}
