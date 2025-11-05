import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { DetalleBoleta } from '../../detalle_boletas/entities/detalle_boleta.entity';
import { Pago } from '../../pagos/entities/pago.entity';

@Entity()
export class Boleta {
    @PrimaryGeneratedColumn({ name: 'idboleta' })
    idBoleta: number;

    @ManyToOne(() => Usuario, (usuario) => usuario.boletas, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "idusuario" })
    idUsuario: Usuario;

    @Column({ type: 'timestamptz', default: () => 'NOW()', name: 'fecha' })
    fecha: Date;

    @Column({ length: 20, name: 'estadoboleta' })
    estadoBoleta: string; // ej: pendiente, pagada, cancelada

    @Column({name: 'subtotalboleta'})
    subtotalBoleta: number;

    @Column({name: 'impuesto'})
    impuesto: number;

    @Column({name: 'totalboleta'})
    totalBoleta: number;

    @OneToMany(() => DetalleBoleta, (detalle) => detalle.idBoleta)
    detalles: DetalleBoleta;

    @OneToMany(() => Pago, (pago) => pago.idBoleta)
    pagos: Pago;
}
