import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Boleta } from '../../boletas/entities/boleta.entity';
import { Rol } from '../../roles/entities/rol.entity';
import { RolUsuario } from 'src/rol_usuarios/entities/rol_usuario.entity';

@Entity('usuario')
export class Usuario {
    @PrimaryGeneratedColumn({ name: 'idUsuario' })
    idUsuario: number;

    @Column({ length: 50, name: 'nombreUsuario' })
    nombreUsuario: string;

    @Column({ length: 50, nullable: true, name: 'apellidoUsuario' })
    apellidoUsuario?: string;

    @Column({nullable: true, name: 'telefono' })
    telefono?: number;

    @Column({ length: 30, unique: true, name: 'rut' })
    rut: string;

    @Column({ length: 100, nullable: true, name: 'direccionUsuario' })
    direccionUsuario?: string;

    @Column({ length: 100, unique: true, name: 'correo' })
    correo: string;

    @Column({ length: 200, name: 'contrasena' })
    contrasena: string;

    @Column({ type: 'timestamptz', default: () => 'NOW()', name: 'fechaCreacion' })
    fechaCreacion: Date;

    @Column({ type: 'timestamptz', default: () => 'NOW()', name: 'fechaActualizacion' })
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
