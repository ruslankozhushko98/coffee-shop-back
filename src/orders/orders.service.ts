import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}

  public getOrders(): Promise<Array<Order>> {
    return this.prismaService.order.findMany();
  }

  public getOrderById(orderId: number): Promise<Order> {
    return this.prismaService.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        beverages: true,
      },
    });
  }

  public async createOrder({
    userId,
    beverageId,
    size,
    type,
  }: CreateOrderDto): Promise<Order> {
    const order = await this.prismaService.order.create({
      data: {
        userId,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const beverageOnOrder = await this.prismaService.beveragesOnOrders.create({
      data: {
        orderId: order.id,
        beverageId,
        size,
        type,
      },
    });

    return order;
  }
}
