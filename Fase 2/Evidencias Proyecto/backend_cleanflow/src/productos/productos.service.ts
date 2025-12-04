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
    return this.productoRepo.find({ where: { productoActivo: true }, relations: ['categoria', 'marca', 'stock', 'stock.bodega'] });
  }

  async findOne(id: number) {
    const producto = await this.productoRepo.findOne({ where: { idProducto: id }, relations: ['categoria', 'marca', 'stock', 'stock.bodega'] });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  async create(dto: CreateProductoDto, file?: Express.Multer.File) {
    const producto = this.productoRepo.create({...dto,
      categoria: { idCategoria: dto.idCategoria },
      marca: { idMarca: dto.idMarca }
    });

    if (file){
      const dataImagen = await this.cloudinary.uploadFile(file)
      producto.urlImagenProducto = dataImagen.url
      producto.publicIdImagen = dataImagen.publicId
    }

    if (!dto.stockInicial || !dto.idBodega) {
      producto.productoActivo = false;
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
        idProducto: producto.idProducto,
        idBodega: dto.idBodega,
        cantidad: dto.stockInicial,
      });
    } else {
      producto.productoActivo = false;
    }

    return productoGuardado;
  }

  async update(id: number, dto: UpdateProductoDto, file?: Express.Multer.File) {
    if ((dto as any).idProducto) {
      delete (dto as any).idProducto;
    }
    const { stock, idBodega, ...dtoProducto } = dto;

    const productoExistente = await this.productoRepo.findOne({ where: { idProducto: id } });
    if (!productoExistente){
      throw new NotFoundException(`El producto con ID ${id} no existe`);
    }

    const updateData: any = { ...dtoProducto };

    if (dto.idCategoria) {
      updateData.categoria = { idCategoria: dto.idCategoria };
    }

    if (dto.idMarca) {
      updateData.marca = { idMarca: dto.idMarca };
    }

    if (file){
      if (productoExistente.publicIdImagen) {
        await this.cloudinary.deleteFile(productoExistente.publicIdImagen);
      }
      const dataImagen = await this.cloudinary.uploadFile(file)
      updateData.urlImagenProducto = dataImagen.url
      updateData.publicIdImagen = dataImagen.publicId
    }

    if (stock !== undefined) {
      
      if (!idBodega) {
        throw new BadRequestException('Para actualizar el stock es obligatorio enviar el idBodega');
      }

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

    if (Object.keys(updateData).length > 0) {
      await this.productoRepo.update({ idProducto: id }, updateData);
    }
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.productoRepo.update({ idProducto: id }, { productoActivo: false });
    return { message: 'Producto desactivado' };
  }

  async buscarPorCategoria(idCategoria: number) {
    return this.productoRepo.find({
      where: { 
        categoria: { idCategoria },
        productoActivo: true
      },
      relations: ['categoria', 'marca', 'stock', 'stock.bodega']
    });
  }
  
  async buscarPorMarca(idMarca: number) {
    return this.productoRepo.find({
      where: { 
        marca: { idMarca },
        productoActivo: true
      },
      relations: ['categoria', 'marca', 'stock', 'stock.bodega']
    });
  }
}