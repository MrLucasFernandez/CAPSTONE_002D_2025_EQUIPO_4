import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Boleta } from '../../boletas/entities/boleta.entity';

@Entity()
export class Pago {
    @PrimaryGeneratedColumn({ name: 'idpago' })
    idPago: number;

    @ManyToOne(() => Boleta, (boleta) => boleta.pagos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idboleta' })
    idBoleta: Boleta;

    @Column({ type: 'timestamptz', default: () => 'NOW()',name: 'fecha' })
    fecha: Date;

    @Column({name: 'monto'})
    monto: number;

    @Column({ length: 20, name: 'estado', default: 'PENDIENTE' })
    estado: string; // ej: COMPLETADO, PENDIENTE, RECHAZADO

    @Column({ length: 30, name: 'metodopago' })
    metodoPago: string; // ej: tarjeta de crEdito, PayPal, transferencia
}
