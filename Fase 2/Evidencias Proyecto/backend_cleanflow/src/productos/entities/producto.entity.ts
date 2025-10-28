import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { Marca } from '../../marcas/entities/marca.entity';

@Entity()
export class Producto {
    @PrimaryGeneratedColumn()
    idProducto: number;

    @Column({ length: 50 })
    nombreProducto: string;

    @Column()
    precioProducto: number;

    @Column()
    precioVentaProducto: number;

    @Column({asExpression: '("precioVentaProducto" - "precioProducto")', generatedType: 'STORED'})
    utilidadProducto: number;

    @Column({ length: 100, nullable: true })
    descripcionProducto?: string;

    @Column({ nullable: true })
    sku?: string;

    @Column({ default: true })
    productoActivo: boolean;
    
    @Column({ length: 30, nullable: true }) 
    marcaProducto?: string;

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    fechaCreacion: Date;

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    fechaActualizacion: Date;

    @ManyToOne(() => Categoria, (categoria) => categoria.productos, { onDelete: 'RESTRICT' })
    idCategoria: Categoria;

    @ManyToOne(() => Marca, (marca) => marca.productos, { onDelete: 'RESTRICT' })
    idMarca: Marca;

    @OneToMany(() => Stock, (stock) => stock.producto)
    stock: Stock[];
}
