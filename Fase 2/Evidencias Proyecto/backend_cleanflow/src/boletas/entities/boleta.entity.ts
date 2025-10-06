import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { DetalleBoleta } from '../../detalle_boletas/entities/detalle_boleta.entity';
import { Pago } from '../../pagos/entities/pago.entity';

@Entity()
export class Boleta {
    @PrimaryGeneratedColumn()
    idBoleta: number;

    @ManyToOne(() => Cliente, (cliente) => cliente.boletas, { onDelete: 'CASCADE' })
    idCliente: Cliente;

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    fecha: Date;

    @Column({ length: 20 })
    estadoBoleta: string; // ej: pendiente, pagada, cancelada

    @Column()
    subtotalBoleta: number;

    @Column()
    impuesto: number;

    @Column()
    totalBoleta: number;

    @OneToMany(() => DetalleBoleta, (detalle) => detalle.idBoleta)
    detalles: DetalleBoleta[];

    @OneToMany(() => Pago, (pago) => pago.idBoleta)
    pagos: Pago[];
}
