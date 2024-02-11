import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { LimitOffset } from 'src/utils/types';
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
  public getOrders(@Query() query: LimitOffset) {
    return this.orderService.getOrders(query);
  }

  @Get('/:orderId')
  public getOrderById(@Param() param: OrderParam) {
    return this.orderService.getOrderById(Number(param.orderId));
  }

  @Post('/create')
  public createOrder(@Body() body: CreateOrderDto) {
    return this.orderService.createOrder(body);
  }
}
