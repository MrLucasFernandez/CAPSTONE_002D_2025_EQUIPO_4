import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Rol } from '../../roles/entities/rol.entity';

@Entity('rol_usuario')
export class RolUsuario {
    @PrimaryColumn({name: 'idusuario'})
    idUsuario: number;

    @PrimaryColumn({name: 'idrol'})
    idRol: number;

    @ManyToOne(() => Usuario, (usuario) => usuario.roles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idusuario' })
    usuario: Usuario;

    @ManyToOne(() => Rol, (rol) => rol.usuarios, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idrol' })
    rol: Rol;
}
