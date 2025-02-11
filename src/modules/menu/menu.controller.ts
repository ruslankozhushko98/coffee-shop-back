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
import { MenuService } from './menu.service';
import { CreateBeverageDto, ToggleFavoriteDto, UpdateBeverageDto } from './dto';
import { Roles } from 'src/common/decorators';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('all')
  public getAllMenu(@Query('title') title: string) {
    return this.menuService.getAllMenu(title);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('favorites')
  public getFavoriteBeverages(@Req() req) {
    return this.menuService.getFavoriteBeverages(req.user?.id);
  }

  @Get(':beverageId')
  public getBeverageById(
    @Param('beverageId', ParseIntPipe) beverageId: number,
    @Req() req,
  ) {
    const host = `${req.protocol}://${req.get('host')}`;
    return this.menuService.getBeverageById(host, beverageId, req.user?.id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLES.ADMIN)
  @Post('beverage/create')
  public createBeverage(dto: CreateBeverageDto) {
    return this.menuService.createBeverage(dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(ROLES.ADMIN)
  @Put(':beverageId/update')
  public updateBeverage(
    @Param('beverageId', ParseIntPipe) beverageId: number,
    @Body() dto: UpdateBeverageDto,
  ) {
    return this.menuService.updateBeverage(beverageId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/toggle-favorite')
  public toggleFavorite(@Body() dto: ToggleFavoriteDto) {
    return this.menuService.toggleFavorite(dto);
  }
}
