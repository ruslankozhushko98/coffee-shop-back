import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';

import { LimitOffset } from 'src/utils/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}

  public getOrders({ limit, offset }: LimitOffset): Promise<Array<Order>> {
    return this.prismaService.order.findMany({
      take: limit,
      skip: offset,
      include: {
        beverages: {
          include: {
            beverage: {
              select: {
                title: true,
                description: true,
              },
            },
          },
        },
      },
    });
  }

  public getOrderById(orderId: number): Promise<Order> {
    return this.prismaService.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        beverages: {
          include: {
            beverage: true,
          },
        },
      },
    });
  }

  public async createOrder({
    userId,
    price,
    beverages,
  }: CreateOrderDto): Promise<Order> {
    const order = await this.prismaService.order.create({
      data: {
        userId,
        price,
      },
    });

    const mappedBeverages = beverages.map((item) => ({
      ...item,
      orderId: order.id,
    }));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const beveragesOnOrder =
      await this.prismaService.beveragesOnOrders.createMany({
        data: mappedBeverages,
      });

    return order;
  }
}
