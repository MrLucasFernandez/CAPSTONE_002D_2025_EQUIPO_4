import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RolUsuario } from '../../rol_usuarios/entities/rol_usuario.entity';

@Entity()
export class Rol {
    @PrimaryGeneratedColumn()
    idRol: number;

    @Column({ length: 50 })
    tipoRol: string;

    @Column({ length: 100, nullable: true })
    descripcionRol?: string;
    
    @OneToMany(() => RolUsuario, (rolUsuario) => rolUsuario.rol)
    usuarios: RolUsuario[];
}
