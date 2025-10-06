import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity()
export class Categoria {
    @PrimaryGeneratedColumn()
    idCategoria: number;

    @Column({ length: 50, unique: true })
    nombreCategoria: string;

    @Column({ length: 250, nullable: true })
    descripcionCategoria?: string;

    @Column({ default: true })
    categoriaActiva: boolean;

    @OneToMany(() => Producto, (producto) => producto.idCategoria)
    productos: Producto[];
}
