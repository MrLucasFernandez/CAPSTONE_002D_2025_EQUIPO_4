import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Boleta } from '../../boletas/entities/boleta.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity()
export class Cliente {
    @PrimaryGeneratedColumn()
    idCliente: number;

    @Column({ length: 50 })
    nombreCliente: string;

    @Column({ length: 50, nullable: true })
    apellidoCliente?: string;

    @Column({ length: 30, nullable: true })
    telefono?: string;

    @Column({ length: 30, unique: true })
    rut: string;

    @Column({ length: 100, nullable: true })
    direccionCliente?: string;

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    fechaCreacion: Date;

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    fechaActualizacion: Date;

    @OneToMany(() => Boleta, (boleta) => boleta.idCliente)
    boletas: Boleta[];

    @OneToMany(() => Usuario, (usuario) => usuario.idCliente)
    usuarios: Usuario[];
}
