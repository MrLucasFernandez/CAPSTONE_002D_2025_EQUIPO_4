import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Boleta } from '../../boletas/entities/boleta.entity';

@Entity()
export class Pago {
    @PrimaryGeneratedColumn()
    idPago: number;

    @ManyToOne(() => Boleta, (boleta) => boleta.pagos, { onDelete: 'CASCADE' })
    idBoleta: Boleta;

    @Column({ type: 'timestamptz', default: () => 'NOW()' })
    fecha: Date;

    @Column()
    monto: number;

    @Column({ length: 20 })
    estado: string; // ej: completado, pendiente, fallido

    @Column({ length: 30 })
    metodoPago: string; // ej: tarjeta de crEdito, PayPal, transferencia
}
