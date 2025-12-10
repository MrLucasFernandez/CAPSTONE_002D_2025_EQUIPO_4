import { Module } from '@nestjs/common';
import { PushService } from './push_token.service';
import { PushController } from './push_token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PushToken } from './entities/push_token.entity';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PushToken, Usuario]), FirebaseModule],
  controllers: [PushController],
  providers: [PushService],
  exports: [PushService],
})
export class PushTokenModule {}
