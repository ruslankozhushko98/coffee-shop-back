import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLES } from '@prisma/client';

import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators';
import { MenuService } from './menu.service';
import { CreateBeverageDto, UpdateBeverageDto } from './dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('all')
  public getAllMenu(@Query('title') title: string, @Req() req) {
    const host = `${req.protocol}://${req.get('host')}`;
    return this.menuService.getAllMenu(host, title);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('favorites')
  public getFavoriteBeverages(@Req() req) {
    return this.menuService.getFavoriteBeverages(req.user?.id);
  }

  @Get('beverages/:beverageId')
  public getBeverageById(
    @Param('beverageId', ParseIntPipe) beverageId: number,
    @Req() req,
  ) {
    const host = `${req.protocol}://${req.get('host')}`;
    return this.menuService.getBeverageById(host, beverageId, req.user?.id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLES.ADMIN)
  @Post('beverages/create')
  public createBeverage(dto: CreateBeverageDto) {
    return this.menuService.createBeverage(dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLES.ADMIN)
  @Put('beverages/:beverageId/update')
  public updateBeverage(
    @Param('beverageId', ParseIntPipe) beverageId: number,
    @Body() dto: UpdateBeverageDto,
  ) {
    return this.menuService.updateBeverage(beverageId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/beverages/:beverageId/toggle-favorite')
  public toggleFavorite(
    @Param('beverageId', ParseIntPipe) beverageId: number,
    @Req() req,
  ) {
    return this.menuService.toggleFavorite({
      beverageId,
      userId: req.user?.id,
    });
  }
}
