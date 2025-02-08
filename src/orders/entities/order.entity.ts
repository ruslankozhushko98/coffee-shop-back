import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { OrderStatuses } from 'src/orders/utils/enums';
import { User } from 'src/auth/entities';
import { Beverage } from 'src/menu/entities';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', nullable: false })
  price: number;

  @Column({ type: 'integer', name: 'stars_count', nullable: true, default: 0 })
  starsCount: number;

  @Column({
    type: 'enum',
    nullable: false,
    enum: OrderStatuses,
    default: OrderStatuses.RECEIVED,
  })
  status: OrderStatuses;

  @Column({ type: 'text', nullable: true, default: '' })
  additionally: string;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  user: User;

  @ManyToMany(() => Beverage)
  @JoinTable()
  beverages: Array<Beverage>;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
