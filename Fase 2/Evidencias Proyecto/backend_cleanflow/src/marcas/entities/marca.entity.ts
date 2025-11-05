import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity()
export class Marca {
    @PrimaryGeneratedColumn({name: 'idmarca'})
    idMarca: number;

    @Column({ length: 50, unique: true, name: 'nombremarca' })
    nombreMarca: string;

    @Column({ length: 250, nullable: true, name: 'descripcionmarca' })
    descripcionMarca?: string;

    @Column({ default: true, name: 'marcaactiva' })
    marcaActiva: boolean;

    @OneToMany(() => Producto, (producto) => producto.idMarca)
    productos: Producto[];
}
