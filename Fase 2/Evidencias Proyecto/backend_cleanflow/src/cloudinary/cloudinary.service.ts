import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    constructor(
    ) {}

    async uploadFile(file: Express.Multer.File): Promise<{ url: string; publicId: string }> {
        try{
            const result: UploadApiResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'productos' },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('Fallo en la subida a Cloudinary'));
                    resolve(result);
                },
            ).end(file.buffer);
        });
            return { url: result.secure_url, publicId: result.public_id };
        } catch (error){
            throw error;
        }
    }

    async deleteFile(publicId: string): Promise<void> {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw error;
        }
    }
    
}