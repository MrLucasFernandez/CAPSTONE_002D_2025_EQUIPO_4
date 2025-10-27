import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { RolUsuario } from '../../rol_usuarios/entities/rol_usuario.entity';
import { Boleta } from '../../boletas/entities/boleta.entity';


@Entity('usuario')
export class Usuario {
    @PrimaryGeneratedColumn()
    idUsuario: number;

    @Column({ length: 50 })
    nombreUsuario: string;

    @Column({ length: 50, nullable: true })
    apellidoUsuario?: string;

    @Column({nullable: true })
    telefono?: number;

    @Column({ length: 30, unique: true })
    rut: string;

    @Column({ length: 100, nullable: true })
    direccionUsuario?: string;

    @Column({ length: 100, unique: true })
    correo: string;

    @Column({ length: 200 })
    contrasena: string;

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    fechaCreacion: Date;

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    fechaActualizacion: Date;

    @OneToMany(() => RolUsuario, (rolUsuario) => rolUsuario.usuario)
    roles: RolUsuario[];

    @OneToMany(() => Boleta, (boleta) => boleta.idUsuario)
    boletas: Boleta[];
}
