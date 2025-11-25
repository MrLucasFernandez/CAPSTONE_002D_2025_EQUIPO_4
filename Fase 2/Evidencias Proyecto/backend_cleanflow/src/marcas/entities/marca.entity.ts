import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity()
export class Marca {
    @PrimaryGeneratedColumn({name: 'idMarca'})
    idMarca: number;

    @Column({ length: 50, unique: true, name: 'nombreMarca' })
    nombreMarca: string;

    @Column({ length: 250, nullable: true, name: 'descripcionMarca' })
    descripcionMarca?: string;

    @Column({ default: true, name: 'marcaActiva' })
    marcaActiva: boolean;

    @OneToMany(() => Producto, (producto) => producto.idMarca)
    productos: Producto[];
}
