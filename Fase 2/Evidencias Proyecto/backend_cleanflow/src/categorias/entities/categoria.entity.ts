import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity()
export class Categoria {
    @PrimaryGeneratedColumn({name : 'idCategoria'})
    idCategoria: number;

    @Column({ length: 50, unique: true, name: 'nombreCategoria' })
    nombreCategoria: string;

    @Column({ length: 250, nullable: true, name: 'descripcionCategoria' })
    descripcionCategoria?: string;

    @Column({ default: true, name: 'categoriaActiva' })
    categoriaActiva: boolean;

    @OneToMany(() => Producto, (producto) => producto.idCategoria)
    productos: Producto[];
}
