import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity()
export class Marca {
    @PrimaryGeneratedColumn()
    idMarca: number;

    @Column({ length: 50, unique: true })
    nombreMarca: string;

    @Column({ length: 250, nullable: true })
    descripcionMarca?: string;

    @Column({ default: true })
    marcaActiva: boolean;

    @OneToMany(() => Producto, (producto) => producto.idMarca)
    productos: Producto[];
}
