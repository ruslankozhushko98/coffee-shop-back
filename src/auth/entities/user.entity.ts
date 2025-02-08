import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

import { Gender } from 'src/utils/constants';
import { Order } from 'src/orders/entities';
import { Beverage } from 'src/menu/entities';
import { Token } from './token.entity';
import { OTC } from './otc.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 6, nullable: false })
  password: string;

  @Column({ type: 'varchar', name: 'first_name', nullable: false })
  firstName: string;

  @Column({ type: 'varchar', name: 'last_name', nullable: false })
  lastName: string;

  @Column({ type: 'varchar', name: 'date_of_birth', nullable: false })
  dob: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.OTHER })
  gender: Gender;

  @Column({
    type: 'varchar',
    name: 'public_key',
    nullable: true,
    default: null,
  })
  publicKey: string | null;

  @Column({
    type: 'boolean',
    name: 'is_activated',
    nullable: false,
    default: false,
  })
  isActivated: boolean;

  @Column({ type: 'integer', name: 'stars_balance', nullable: false })
  starsBalance: boolean;

  @OneToMany(() => Order, (order) => order.user, { onDelete: 'CASCADE' })
  orders: Array<Order>;

  @ManyToMany(() => Beverage, { onDelete: 'CASCADE' })
  @JoinTable()
  favoriteBeverages: Array<Beverage>;

  @OneToOne(() => Token, (token) => token.user, { onDelete: 'CASCADE' })
  token: Token;

  @OneToOne(() => OTC, (otc) => otc.user, { onDelete: 'CASCADE' })
  otc: OTC;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
