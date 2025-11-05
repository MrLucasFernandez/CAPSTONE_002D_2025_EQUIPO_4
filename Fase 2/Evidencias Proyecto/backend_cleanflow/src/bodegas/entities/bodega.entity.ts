import { Stock } from 'src/stock/entities/stock.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Bodega {
    @PrimaryGeneratedColumn({name : 'idbodega'})
    idBodega: number;

    @Column({ length: 50, name: 'nombrebodega' })
    nombre: string;

    @Column({ length: 200, nullable: true, name: 'direccionbodega' })
    direccion: string;

    @OneToMany(() => Stock, (stock) => stock.idBodega)
    stock: Stock[];
}
