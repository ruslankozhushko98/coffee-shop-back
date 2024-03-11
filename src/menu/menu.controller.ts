import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { MenuService } from './menu.service';
import { ToggleFavoriteDto, UpdateBeverageDto } from './dto';

@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Get('all')
  public getAllMenu(@Param('title') title?: string) {
    return this.menuService.getAllMenu(title);
  }

  @Get(':beverageId')
  public getBeverageById(
    @Param('beverageId', ParseIntPipe) beverageId: number,
  ) {
    return this.menuService.getBeverageById(beverageId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':beverageId/update')
  public updateBeverage(
    @Param('beverageId', ParseIntPipe) beverageId: number,
    dto: UpdateBeverageDto,
  ) {
    return this.menuService.updateBeverage(beverageId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/toggle-favorite')
  public toggleFavorite(@Body() dto: ToggleFavoriteDto) {
    return this.menuService.toggleFavorite(dto);
  }
}
