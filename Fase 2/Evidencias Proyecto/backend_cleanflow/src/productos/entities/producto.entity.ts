import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { Marca } from '../../marcas/entities/marca.entity';

@Entity()
export class Producto {
    @PrimaryGeneratedColumn({name: 'idproducto'})
    idProducto: number;

    @Column({ length: 50, name: 'nombreproducto' })
    nombreProducto: string;

    @Column({name: 'preciocompraproducto'})
    precioCompraProducto: number;

    @Column({asExpression: '(precioCompraProducto * 1.35)', generatedType: 'STORED', name: 'precioventaproducto'})
    precioVentaProducto: number;

    @Column({asExpression: '(precioCompraProducto * 0.19)', generatedType: 'STORED', name: 'impuestocompra'})
    impuestoCompra: number;

    @Column({asExpression: '((precioCompraProducto * 1.35) * 0.19)', generatedType: 'STORED', name: 'impuestoventa'})
    impuestoVenta: number;

    @Column({asExpression: '((precioCompraProducto * 1.35) - precioCompraProducto)', generatedType: 'STORED', name: 'utilidadproducto'})
    utilidadProducto: number;

    @Column({ length: 100, nullable: true, name: 'descripcionproducto' })
    descripcionProducto?: string;

    @Column({ nullable: true, name: 'sku' })
    sku?: string;

    @Column({ default: true, name: 'productoactivo' })
    productoActivo: boolean;

    @Column({ length: 200, nullable: true, name: 'urlimagenproducto' })
    urlImagenProducto?: string;

    @Column({ type: 'timestamptz', default: () => 'NOW()', name: 'fechacreacion' })
    fechaCreacion: Date;

    @Column({ type: 'timestamptz', default: () => 'NOW()', name: 'fechaactualizacion' })
    fechaActualizacion: Date;

    @ManyToOne(() => Categoria, (categoria) => categoria.productos, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'idcategoria' })
    idCategoria: Categoria;

    @ManyToOne(() => Marca, (marca) => marca.productos, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'idmarca' })
    idMarca: Marca;

    @OneToMany(() => Stock, (stock) => stock.producto)
    stock: Stock[];
}
