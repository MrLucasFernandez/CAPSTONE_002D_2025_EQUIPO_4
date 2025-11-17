import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { Stock } from '../stock/entities/stock.entity';
import { Bodega } from 'src/bodegas/entities/bodega.entity';
import { CreateProductoDto, UpdateProductoDto } from './dto/producto.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,

    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>,

    @InjectRepository(Bodega)
    private readonly bodegaRepo: Repository<Bodega>,
    
    private readonly cloudinary: CloudinaryService
  ) {}

  findAll() {
    return this.productoRepo.find({ where: { productoActivo: true } });
  }

  async findOne(id: number) {
    const producto = await this.productoRepo.findOne({ where: { idProducto: id }, relations: ['idCategoria', 'idMarca', 'stock'] });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  async create(dto: CreateProductoDto, file?: Express.Multer.File) {
    const producto = this.productoRepo.create(dto);

    if (file){
      const { url, publicId } = await this.cloudinary.uploadFile(file)
      producto.urlImagenProducto = url
      producto.publicIdImagen = publicId
    }
    
    const productoGuardado = await this.productoRepo.save(producto);

    if (dto.stockInicial && dto.idBodega) {
      const bodega = await this.bodegaRepo.findOne({ where: { idBodega: dto.idBodega } });
      if (!bodega) {
        throw new NotFoundException('La bodega de ID: ' + dto.idBodega + ' no existe');
      }

      if (dto.stockInicial < 0) {
        throw new BadRequestException('El stock inicial no puede ser negativo');
      }
      await this.stockRepo.save({
        idProducto: productoGuardado.idProducto,
        idBodega: dto.idBodega,
        cantidad: dto.stockInicial,
      });
    }

    return productoGuardado;
  }

  async update(id: number, dto: UpdateProductoDto, file: Express.Multer.File) {
    const { stock, idBodega, ...dtoProducto } = dto;

    const productoExistente = await this.productoRepo.findOne({ where: { idProducto: id } });
    if (!productoExistente){
      throw new NotFoundException(`El producto con ID ${id} no existe`);
    }

    if (dto.stock !== undefined || dto.idBodega !== undefined) {
      if (dto.stock! < 0) {
        throw new BadRequestException('El stock no puede ser negativo');
        
      }
      const stockExistente = await this.stockRepo.findOne({ where: { producto:{idProducto: id}, bodega:{idBodega: dto.idBodega }},});

      if (!stockExistente) {
        throw new NotFoundException('Registro de stock no encontrado para el producto y bodega especificados');
      }
      await this.stockRepo.update(
        { producto:{idProducto: id}, bodega:{idBodega: dto.idBodega }},
        { cantidad: dto.stock },
      );
    }
    if (file){
      if (productoExistente.publicIdImagen) {
        await this.cloudinary.deleteFile(productoExistente.publicIdImagen);
      }
      
      const { url, publicId } = await this.cloudinary.uploadFile(file)
      dtoProducto.urlImagenProducto = url
      dtoProducto.publicIdImagen = publicId
    }

    await this.productoRepo.update({ idProducto: id }, dtoProducto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.productoRepo.update({ idProducto: id }, { productoActivo: false });
    return { message: 'Producto desactivado' };
  }
}