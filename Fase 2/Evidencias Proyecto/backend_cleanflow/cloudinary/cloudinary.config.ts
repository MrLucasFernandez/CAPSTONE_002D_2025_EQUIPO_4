import { v2 as cloudinary } from 'cloudinary';

console.log('🌩️ Cloudinary Config:', {
    name: process.env.CLOUDINARY_NAME,
    key: process.env.CLOUDINARY_KEY,
    secret: process.env.CLOUDINARY_SECRET ? '✅ OK' : '❌ Missing',
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

export default cloudinary;
