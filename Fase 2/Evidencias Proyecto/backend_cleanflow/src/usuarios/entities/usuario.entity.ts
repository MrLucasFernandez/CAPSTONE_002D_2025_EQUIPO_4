import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Boleta } from '../../boletas/entities/boleta.entity';
import { Rol } from '../../roles/entities/rol.entity';
import { RolUsuario } from 'src/rol_usuarios/entities/rol_usuario.entity';

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

    @ManyToMany(() => Rol, (rol) => rol.usuarios, { eager: true })
    @JoinTable({
        name: 'rol_usuario',
        joinColumn: { name: 'idUsuario', referencedColumnName: 'idUsuario' },
        inverseJoinColumn: { name: 'idRol', referencedColumnName: 'idRol' },
    })
    roles: Rol[];

    @OneToMany(() => RolUsuario, (rolUsuario) => rolUsuario.usuario)
    rolesUsuario: RolUsuario[];

    @OneToMany(() => Boleta, (boleta) => boleta.idUsuario)
    boletas: Boleta[];
}
