import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { LimitOffset } from 'src/utils/types';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';

@UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Get('/')
  public getOrders(@Query() query: LimitOffset) {
    return this.orderService.getOrders(query);
  }

  @Get('/:orderId')
  public getOrderById(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.getOrderById(orderId);
  }

  @Post('/create')
  public createOrder(@Body() body: CreateOrderDto) {
    return this.orderService.createOrder(body);
  }

  @Patch('/:orderId/update-status')
  public updateOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(orderId, dto.status);
  }
}
