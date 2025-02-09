import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { MenuService } from './menu.service';
import { ToggleFavoriteDto, UpdateBeverageDto } from './dto';

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

  @UseGuards(AuthGuard('jwt'))
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
