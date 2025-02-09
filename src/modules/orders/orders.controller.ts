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
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { LimitOffset } from 'src/shared/utils/types';
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
  public createOrder(@Req() req, @Body() body: Omit<CreateOrderDto, 'userId'>) {
    return this.orderService.createOrder({
      ...body,
      userId: req.user.id,
    });
  }

  @Patch('/:orderId/update-status')
  public updateOrderStatus(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrderStatus(orderId, dto.status);
  }
}
