import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { BeverageTypes, Sizes } from 'src/orders/utils/enums';

@Entity({ name: 'beverages_on_orders' })
export class BeveragesOnOrders {
  @PrimaryColumn({ name: 'beverage_id' })
  beverageId: number;

  @PrimaryColumn({ name: 'order_id' })
  orderId: number;

  @Column({ type: 'enum', enum: Sizes, default: Sizes.SMALL })
  size: Sizes;

  @Column({ type: 'enum', enum: BeverageTypes, default: BeverageTypes.HOT })
  type: BeverageTypes;

  @Column({ type: 'integer', nullable: false, default: 1 })
  qty: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
