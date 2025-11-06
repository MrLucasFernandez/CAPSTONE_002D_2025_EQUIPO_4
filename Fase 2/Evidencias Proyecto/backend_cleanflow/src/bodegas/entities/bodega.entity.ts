import { Stock } from 'src/stock/entities/stock.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Bodega {
    @PrimaryGeneratedColumn({name : 'idBodega'})
    idBodega: number;

    @Column({ length: 50, name: 'nombre' })
    nombre: string;

    @Column({ length: 200, nullable: true, name: 'direccion' })
    direccion: string;

    @OneToMany(() => Stock, (stock) => stock.bodega)
    stock: Stock[];
}
