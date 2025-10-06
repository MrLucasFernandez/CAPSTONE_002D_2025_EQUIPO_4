import { Stock } from 'src/stock/entities/stock.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Bodega {
    @PrimaryGeneratedColumn()
    idBodega: number;

    @Column({ length: 50 })
    nombre: string;

    @Column({ length: 200, nullable: true })
    direccion: string;

    @OneToMany(() => Stock, (stock) => stock.idBodega)
    stock: Stock[];
}
