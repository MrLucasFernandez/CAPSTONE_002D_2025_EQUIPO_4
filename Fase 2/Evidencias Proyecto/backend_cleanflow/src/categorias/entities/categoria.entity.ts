import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity()
export class Categoria {
    @PrimaryGeneratedColumn({name : 'idcategoria'})
    idCategoria: number;

    @Column({ length: 50, unique: true, name: 'nombrecategoria' })
    nombreCategoria: string;

    @Column({ length: 250, nullable: true, name: 'descripcioncategoria' })
    descripcionCategoria?: string;

    @Column({ default: true, name: 'categoriaactiva' })
    categoriaActiva: boolean;

    @OneToMany(() => Producto, (producto) => producto.idCategoria)
    productos: Producto[];
}
