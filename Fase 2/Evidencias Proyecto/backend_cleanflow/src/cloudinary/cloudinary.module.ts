import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryService,
    {
      provide: 'CLOUDINARY',
      inject: [ConfigService],
      useFactory: (cfg: CloudinaryService) => {
        const name = process.env.CLOUDINARY_NAME;
        const key = process.env.CLOUDINARY_KEY;
        const secret = process.env.CLOUDINARY_SECRET;

        cloudinary.config({
          cloud_name: name,
          api_key: key,
          api_secret: secret,
        });
        return cloudinary;
      },
    }
  ],
  exports: ['CLOUDINARY',CloudinaryService],
})
export class CloudinaryModule {}
