import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto';

type OrderParam = {
  orderId: number;
};

@UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Get('/')
  public getOrders() {
    return this.orderService.getOrders();
  }

  @Get('/:orderId')
  public getOrderById(@Param() param: OrderParam) {
    return this.orderService.getOrderById(param.orderId);
  }

  @Post('/create')
  public createOrder(@Body() body: CreateOrderDto) {
    return this.orderService.createOrder(body);
  }
}
