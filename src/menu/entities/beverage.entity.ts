import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from 'src/auth/entities';
import { Order } from 'src/orders/entities';

@Entity()
export class Beverage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  title: string;

  @Column({ type: 'text', nullable: true, default: '' })
  description: string;

  @Column({ type: 'text', name: 'img_url', nullable: true, default: null })
  imgUrl: string;

  @Column({ type: 'decimal', nullable: false })
  price: number;

  @Column({ type: 'integer', name: 'stars_count', nullable: false })
  starsCount: number;

  @ManyToMany(() => User, { onDelete: 'CASCADE' })
  usersWhoLiked: Array<User>;

  @ManyToMany(() => Order)
  orders: Array<Order>;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
