import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Boleta } from '../../boletas/entities/boleta.entity';

@Entity()
export class Pago {
    @PrimaryGeneratedColumn({ name: 'idPago' })
    idPago: number;

    @ManyToOne(() => Boleta, (boleta) => boleta.pagos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idBoleta' })
    idBoleta: Boleta;

    @Column({ type: 'timestamptz', default: () => 'NOW()',name: 'fecha' })
    fecha: Date;

    @Column({name: 'monto'})
    monto: number;

    @Column({ length: 20, name: 'estado', default: 'PENDIENTE' })
    estado: string; // ej: COMPLETADO, PENDIENTE, RECHAZADO

    @Column({ length: 30, name: 'metodoPago' })
    metodoPago: string; // ej: tarjeta de crEdito, PayPal, transferencia
}
