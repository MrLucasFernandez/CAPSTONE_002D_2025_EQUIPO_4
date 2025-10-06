import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { RolUsuario } from '../../rol_usuarios/entities/rol_usuario.entity';


@Entity('usuario')
export class Usuario {
    @PrimaryGeneratedColumn()
    idUsuario: number;

    @Column({ length: 100, unique: true })
    correo: string;

    @Column({ length: 200 })
    contraseña: string;

    @ManyToOne(() => Cliente, (cliente) => cliente.usuarios, { onDelete: 'SET NULL' })
    idCliente: Cliente;

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    fechaCreacion: Date;

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    fechaActualizacion: Date;

    @OneToMany(() => RolUsuario, (rolUsuario) => rolUsuario.usuario)
    roles: RolUsuario[];
}
