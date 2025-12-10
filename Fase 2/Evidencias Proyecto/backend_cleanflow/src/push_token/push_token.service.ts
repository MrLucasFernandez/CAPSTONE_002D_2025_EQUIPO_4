import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PushToken } from './entities/push_token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FirebaseService } from '../firebase/firebase.service';


@Injectable()
export class PushService {
  constructor(
    @InjectRepository(PushToken)
    private repo: Repository<PushToken>,
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
    // TODO: eliminar tokens inválidos según respuesta.responses
    return res;
  }
}
