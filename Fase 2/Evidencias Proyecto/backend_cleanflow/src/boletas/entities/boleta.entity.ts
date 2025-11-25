import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { DetalleBoleta } from '../../detalle_boletas/entities/detalle_boleta.entity';
import { Pago } from '../../pagos/entities/pago.entity';

@Entity()
export class Boleta {
    @PrimaryGeneratedColumn({ name: 'idBoleta' })
    idBoleta: number;

    @ManyToOne(() => Usuario, (usuario) => usuario.boletas, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "idUsuario" })
    idUsuario: Usuario;

    @Column({ type: 'timestamptz', default: () => 'NOW()', name: 'fecha' })
    fecha: Date;

    @Column({ length: 20, name: 'estadoBoleta' })
    estadoBoleta: string; // ej: pendiente, pagada, cancelada

    @Column({name: 'subtotalBoleta'})
    subtotalBoleta: number;

    @Column({name: 'impuesto'})
    impuesto: number;

    @Column({name: 'totalBoleta'})
    totalBoleta: number;

    @OneToMany(() => DetalleBoleta, (detalle) => detalle.idBoleta)
    detalles: DetalleBoleta[];

    @OneToMany(() => Pago, (pago) => pago.idBoleta)
    pagos: Pago;
}
