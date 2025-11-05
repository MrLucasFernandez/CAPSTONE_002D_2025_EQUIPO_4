import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { RolUsuario } from 'src/rol_usuarios/entities/rol_usuario.entity';

@Entity()
export class Rol {
    @PrimaryGeneratedColumn({ name: 'idrol' })
    idRol: number;

    @Column({ length: 50, name: 'tiporol' })
    tipoRol: string;

    @Column({ length: 100, nullable: true, name: 'descripcionrol' })
    descripcionRol?: string;
    
    @ManyToMany(() => Usuario, (usuario) => usuario.roles)
    usuarios: Usuario[];

    @OneToMany(() => RolUsuario, (rolUsuario) => rolUsuario.rol)
    usuariosRol: RolUsuario[];
}
