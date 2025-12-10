import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PushToken } from 'src/push_token/entities/push_token.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PushToken])],
    providers: [FirebaseService],
    exports: [FirebaseService],
})
export class FirebaseModule {}
