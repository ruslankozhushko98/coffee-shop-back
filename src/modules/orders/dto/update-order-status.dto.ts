import { ORDER_STATUS } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsEnum(ORDER_STATUS)
  @IsNotEmpty()
  status: ORDER_STATUS;
}
