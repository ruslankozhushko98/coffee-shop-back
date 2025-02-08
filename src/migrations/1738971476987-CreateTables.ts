import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

import { Gender } from 'src/utils/constants';
import { BeverageTypes, OrderStatuses, Sizes } from 'src/orders/utils/enums';

export class CreateTables1738971476987 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'password', type: 'varchar', isUnique: true },
          { name: 'first_name', type: 'varchar', isUnique: true },
          { name: 'last_name', type: 'varchar', isUnique: true },
          { name: 'date_of_birth', type: 'varchar', isUnique: true },
          {
            name: 'gender',
            type: 'enum',
            enum: [Gender.MALE, Gender.FEMALE, Gender.OTHER],
            default: `'${Gender.OTHER}'`,
          },
          {
            name: 'public_key',
            type: 'varchar',
            isNullable: false,
            default: null,
          },
          { name: 'is_activated', type: 'boolean', default: false },
          { name: 'stars_balance', type: 'int', isNullable: true, default: 0 },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'beverages',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'title', type: 'varchar', isUnique: true },
          { name: 'description', type: 'text' },
          { name: 'img_url', type: 'varchar', isNullable: true, default: null },
          { name: 'price', type: 'decimal' },
          { name: 'stars_count', type: 'int', isNullable: true, default: 0 },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'user_id', type: 'int' },
          { name: 'price', type: 'decimal' },
          {
            name: 'status',
            type: 'enum',
            enum: [
              OrderStatuses.RECEIVED,
              OrderStatuses.PROCESSING,
              OrderStatuses.READY,
              OrderStatuses.CANCELLED,
            ],
            default: `'${OrderStatuses.RECEIVED}'`,
          },
          { name: 'stars_count', type: 'int', isNullable: true, default: 0 },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'beverages_on_orders',
        columns: [
          { name: 'beverage_id', type: 'int' },
          { name: 'order_id', type: 'int' },
          { name: 'price', type: 'decimal' },
          {
            name: 'size',
            type: 'enum',
            enum: [Sizes.SMALL, Sizes.MEDIUM, Sizes.LARGE],
            default: `'${Sizes.SMALL}'`,
          },
          {
            name: 'type',
            type: 'enum',
            enum: [BeverageTypes.HOT, BeverageTypes.ICE, BeverageTypes.NO_ICE],
          },
          { name: 'qty', type: 'int', default: 1 },
          { name: 'stars_count', type: 'int', isNullable: true, default: 0 },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'NO ACTION',
      }),
    );

    await queryRunner.createForeignKey(
      'beverages_on_orders',
      new TableForeignKey({
        columnNames: ['beverage_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'beverages',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'beverages_on_orders',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('beverages_on_orders');
    await queryRunner.dropTable('beverages');
    await queryRunner.dropTable('orders');
  }
}
