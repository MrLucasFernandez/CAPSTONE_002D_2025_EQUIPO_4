import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('push_tokens')
export class PushToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    userId: number;

    @Column({ unique: true })
    token: string;

    @Column({ nullable: true })
    platform: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
